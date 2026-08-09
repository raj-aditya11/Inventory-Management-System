const db = require("../config/db");

const { createNotification } = require("./notificationController");

exports.createTransferRequest = async (req, res) => {
    try {

        const {
            assignment_id,
            to_user,
            quantity,
            reason,
        } = req.body;

        const requestedBy = req.user.id;

        // Required field validation
        if (
            assignment_id == null ||
            to_user == null ||
            quantity == null ||
            !reason?.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided.",
            });
        }

        // Convert numeric values
        const assignmentId = Number(assignment_id);
        const toUser = Number(to_user);
        const transferQuantity = Number(quantity);

        const trimmedReason = reason.trim();

        // Validate IDs
        if (!Number.isInteger(assignmentId) || assignmentId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid assignment ID.",
            });
        }

        if (!Number.isInteger(toUser) || toUser <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid destination user.",
            });
        }

        if (!Number.isInteger(transferQuantity) || transferQuantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be greater than zero.",
            });
        }

        // User cannot transfer to themselves
        if (requestedBy === toUser) {
            return res.status(400).json({
                success: false,
                message: "Cannot transfer asset to yourself.",
            });
        }

        // Check assignment exists
        const [assignment] = await db.query(
            `
            SELECT
                assignment_id,
                inventory_id,
                user_id,
                quantity
            FROM asset_assignment
            WHERE assignment_id = ?
            AND is_deleted = ?
            `,
            [assignmentId, "no"]
        );

        if (assignment.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Assignment not found.",
            });
        }

        // Ensure requester owns the assignment
        if (assignment[0].user_id !== requestedBy) {
            return res.status(403).json({
                success: false,
                message: "You can only transfer your own assigned assets.",
            });
        }

        // Check quantity
        if (transferQuantity > assignment[0].quantity) {
            return res.status(400).json({
                success: false,
                message: "Transfer quantity exceeds assigned quantity.",
            });
        }

        // Check destination user
        const [destinationUser] = await db.query(
            `
            SELECT
                id,
                group_id
            FROM users
            WHERE id = ?
            AND is_deleted = ?
            `,
            [toUser, "no"]
        );

        if (destinationUser.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Destination user not found.",
            });
        }

        // Check requester
        const [requester] = await db.query(
            `
            SELECT
                id,
                group_id
            FROM users
            WHERE id = ?
            AND is_deleted = ?
            `,
            [requestedBy, "no"]
        );

        if (requester.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const sameGroup = requester[0].group_id === destinationUser[0].group_id ? "yes": "no";

        // Prevent duplicate pending requests
        const [existingRequest] = await db.query(
            `
            SELECT transfer_request_id
            FROM transfer_requests
            WHERE assignment_id = ?
            AND requested_by = ?
            AND to_user = ?
            AND status = 1
            AND is_deleted = 'no'
            `,
            [
                assignmentId,
                requestedBy,
                toUser,
            ]
        );

        if (existingRequest.length > 0) {
            return res.status(409).json({
                success: false,
                message: "A pending transfer request already exists.",
            });
        }

        const recipient = destinationUser[0];

        if (
            requester[0].group_id == null ||
            recipient.group_id == null
        ){

            return res.status(400).json({
                success: false,
                message: "Both users must belong to a valid group.",
            });

        }

        const [destinationHolder] = await db.query(
            `
            SELECT id
            FROM users
            WHERE
                group_id = ?
                AND role = 'INVENTORY_HOLDER'
                AND is_deleted = 'no'
            `,
            [recipient.group_id]
        );

        if (destinationHolder.length === 0) {

            return res.status(400).json({
                success: false,
                message: "The selected user's group does not have an active Inventory Holder.",
            });

        }

        // Insert request
        const [result] = await db.query(
            `
            INSERT INTO transfer_requests
            (
                assignment_id,
                requested_by,
                to_user,
                quantity,
                same_group_transfer,
                source_holder_status,
                destination_holder_status,
                status,
                reason
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                assignmentId,
                requestedBy,
                toUser,
                transferQuantity,
                sameGroup,

                0,                                  // source holder pending
                sameGroup === "yes" ? null : 0,     // destination holder pending only for cross-group
                1,                                  // Pending

                trimmedReason,
            ]
        );

        // Find Source Inventory Holder
        const [holder] = await db.query(
            `
            SELECT id
            FROM users
            WHERE
                role = 'INVENTORY_HOLDER'
                AND group_id = ?
                AND is_deleted = 'no'
            LIMIT 1
            `,
            [requester[0].group_id]
        );

        if (holder.length > 0) {

            await db.query(
                `
                INSERT INTO notifications
                (
                    receiver_id,
                    title,
                    message
                )
                VALUES (?, ?, ?)
                `,
                [
                    holder[0].id,
                    "Transfer Request",
                    "A new transfer request requires your approval."
                ]
            );

        }


        return res.status(201).json({
            success: true,
            message: "Transfer request created successfully.",
            transferRequestId: result.insertId,
            sameGroup,
        });

    } catch (error) {

        console.error("Create Transfer Request Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }
};

exports.getAllTransferRequests = async (req, res) => {
    const userId = req.user.id;
    const role = req.user.role;

    try {

        const [transferRequests] = await db.query(
            `
            SELECT
                tr.transfer_request_id,
                i.ledger_number,
                a.asset_name,
                ru.user_name AS requested_by,
                tu.user_name AS to_user,
                tr.quantity,
                tr.reason,
                tr.source_holder_status,
                tr.destination_holder_status,
                tr.status,
                tr.requested_at
            FROM transfer_requests tr

            INNER JOIN asset_assignment aa
                ON tr.assignment_id = aa.assignment_id

            INNER JOIN inventory i
                ON aa.inventory_id = i.inventory_id

            INNER JOIN assets a
                ON i.asset_id = a.asset_id

            INNER JOIN users ru
                ON tr.requested_by = ru.id

            INNER JOIN users tu
                ON tr.to_user = tu.id

            WHERE tr.is_deleted = ?

            ORDER BY tr.requested_at DESC
            `,
            ["no"]
        );

        return res.status(200).json({
            success: true,
            count: transferRequests.length,
            data: transferRequests,
        });

    } catch (error) {

        console.error("Get All Transfer Requests Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }
};

exports.getMyTransferRequests = async (req, res) => {

    try {

        const userId = req.user.id;

       const [requests] = await db.query(
            `
            SELECT
                tr.transfer_request_id,
                tr.assignment_id,
                i.ledger_number,
                i.sr_no,
                a.asset_name,

                CONCAT_WS(
                    ' ',
                    tu.first_name,
                    tu.middle_name,
                    tu.last_name
                ) AS transfer_to_name,

                tr.quantity,
                tr.reason,
                tr.status,
                tr.requested_at

            FROM transfer_requests tr

            INNER JOIN asset_assignment aa
                ON tr.assignment_id = aa.assignment_id

            INNER JOIN inventory i
                ON aa.inventory_id = i.inventory_id

            INNER JOIN assets a
                ON i.asset_id = a.asset_id

            INNER JOIN users tu
                ON tr.to_user = tu.id

            WHERE tr.requested_by = ?
            AND tr.is_deleted = 'no'

            ORDER BY tr.requested_at DESC
            `,
            [userId]
        );

        return res.status(200).json({
            success: true,
            count: requests.length,
            data: requests,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }

};

exports.getPendingTransferRequests = async (req, res) => {

    try {

        const userId = req.user.id;

        const [holder] = await db.query(
            `
            SELECT group_id
            FROM users
            WHERE
                id = ?
                AND role = 'INVENTORY_HOLDER'
                AND is_deleted = 'no'
            `,
            [userId]
        );

        if (holder.length === 0) {

            return res.status(403).json({
                success: false,
                message: "Inventory Holder not found.",
            });

        }

        const groupId = holder[0].group_id;

        const [requests] = await db.query(
            `
            SELECT
                tr.transfer_request_id,
                i.ledger_number,
                a.asset_name,

                CONCAT(
                    ru.first_name,
                    ' ',
                    COALESCE(ru.last_name, '')
                ) AS requested_by,

                CONCAT(
                    tu.first_name,
                    ' ',
                    COALESCE(tu.last_name, '')
                ) AS to_user,

                tr.quantity,
                tr.reason,
                tr.same_group_transfer,
                tr.source_holder_status,
                tr.destination_holder_status,
                tr.status,
                tr.requested_at

            FROM transfer_requests tr

            INNER JOIN asset_assignment aa
                ON tr.assignment_id = aa.assignment_id

            INNER JOIN inventory i
                ON aa.inventory_id = i.inventory_id

            INNER JOIN assets a
                ON i.asset_id = a.asset_id

            INNER JOIN users ru
                ON tr.requested_by = ru.id

            INNER JOIN users tu
                ON tr.to_user = tu.id

            WHERE
            (
                /* Same-group transfer */
                (
                    ru.group_id = ?
                    AND tr.same_group_transfer = 'yes'
                    AND tr.source_holder_status = 0
                )

                OR

                /* Cross-group waiting for SOURCE holder */
                (
                    ru.group_id = ?
                    AND tr.same_group_transfer = 'no'
                    AND tr.source_holder_status = 0
                )

                OR

                /* Cross-group waiting for DESTINATION holder */
                (
                    tu.group_id = ?
                    AND tr.same_group_transfer = 'no'
                    AND tr.source_holder_status = 1
                    AND tr.destination_holder_status = 0
                )
            )
            AND tr.is_deleted = 'no'

            ORDER BY tr.requested_at DESC
            `,
            [
                groupId,
                groupId,
                groupId,
            ]
        );

        return res.status(200).json({
            success: true,
            count: requests.length,
            data: requests,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }

};

exports.getTransferRequestById = async (req, res) => {
    try {

        const { id } = req.params;

        const transferRequestId = Number(id);

        // Validate ID
        if (!Number.isInteger(transferRequestId) || transferRequestId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid transfer request ID.",
            });
        }

        const [transferRequest] = await db.query(
            `
            SELECT
                tr.transfer_request_id,
                a.asset_name,
                ru.user_name AS requested_by,
                tu.user_name AS to_user,
                tr.quantity,
                tr.reason,
                tr.source_holder_status,
                tr.destination_holder_status,
                tr.status,
                tr.requested_at,
                tr.source_approved_at,
                tr.destination_approved_at,
                tr.remarks

            FROM transfer_requests tr

            INNER JOIN asset_assignment aa
                ON tr.assignment_id = aa.assignment_id

            INNER JOIN inventory i
                ON aa.inventory_id = i.inventory_id

            INNER JOIN assets a
                ON i.asset_id = a.asset_id

            INNER JOIN users ru
                ON tr.requested_by = ru.id

            INNER JOIN users tu
                ON tr.to_user = tu.id

            WHERE tr.transfer_request_id = ?
            AND tr.is_deleted = ?
            `,
            [transferRequestId, "no"]
        );

        if (transferRequest.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Transfer request not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: transferRequest[0],
        });

    } catch (error) {

        console.error("Get Transfer Request By ID Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }
};

exports.approveTransferBySourceHolder = async (req, res) => {
    console.log("Approve called");
    try {

        const { id } = req.params;

        const transferRequestId = Number(id);

        const approvedBy = req.user.id;

        // Validate ID
        if (!Number.isInteger(transferRequestId) || transferRequestId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid transfer request ID.",
            });
        }

        // Check transfer request exists
        const [transferRequest] = await db.query(
            `
            SELECT
                transfer_request_id,
                requested_by,
                source_holder_status,
                destination_holder_status,
                status,
                same_group_transfer
            FROM transfer_requests
            WHERE transfer_request_id = ?
            AND is_deleted = ?
            `,
            [transferRequestId, "no"]
        );

        if (transferRequest.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Transfer request not found.",
            });
        }

        // Already rejected
        if (transferRequest[0].status === 0) {
            return res.status(400).json({
                success: false,
                message: "Transfer request has already been rejected.",
            });
        }

        // Already completed
        if (transferRequest[0].status === 2) {
            return res.status(400).json({
                success: false,
                message: "Transfer request has already been completed.",
            });
        }

        // Already approved by source holder
        if (transferRequest[0].source_holder_status === 1) {
            return res.status(400).json({
                success: false,
                message: "Source Inventory Holder has already approved this request.",
            });
        }

        // Same group transfer
        if (transferRequest[0].same_group_transfer === "yes") {
            console.log("Same group transfer");

            await db.query(
                `
                UPDATE transfer_requests
                SET
                    source_holder_status = ?,
                    destination_holder_status = ?,
                    source_approved_at = NOW(),
                    destination_approved_at = NOW()
                WHERE transfer_request_id = ?
                `,
                [
                    1,
                    1,
                    transferRequestId,
                ]
            );

            await db.query(
                `
                UPDATE transfer_requests
                SET status = 2
                WHERE transfer_request_id = ?
                `,
                [transferRequestId]
            );
            console.log("Updated holder status");


            await db.query(
                `
                INSERT INTO notifications
                (
                    receiver_id,
                    title,
                    message
                )
                VALUES (?, ?, ?)
                `,
                [
                    transferRequest[0].requested_by,
                    "Transfer Approved",
                    "Your transfer request has been approved and completed."
                ]
            );

            console.log("Returning success");
            return res.status(200).json({
                success: true,
                message: "Transfer approved successfully.",
            });

        }

        // Different group transfer
        await db.query(
            `
            UPDATE transfer_requests
            SET
                source_holder_status = ?,
                source_approved_at = NOW()
            WHERE transfer_request_id = ?
            `,
            [
                1,
                transferRequestId,
            ]
        );

        await db.query(
            `
            INSERT INTO notifications
            (
                receiver_id,
                title,
                message
            )
            VALUES (?, ?, ?)
            `,
            [
                transferRequest[0].requested_by,
                "Transfer Approved",
                "Source Inventory Holder approved your request. Waiting for Destination Inventory Holder approval."
            ]
        );

        return res.status(200).json({
            success: true,
            message: "Source Inventory Holder approved the transfer request.",
        });

    } catch (error) {

        console.error("Approve Source Transfer Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }
};

const completeTransferInternal = async (
    connection,
    transferRequestId,
    approvedBy
) => {

};

exports.completeTransfer = async (req, res) => {
    let connection;

    try {

        connection = await db.getConnection();
        await connection.beginTransaction();

        const { id } = req.params;

        const transferRequestId = Number(id);

        const approvedBy = req.user.id;

        // Validate ID
        if (!Number.isInteger(transferRequestId) || transferRequestId <= 0) {
            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Invalid transfer request ID.",
            });
        }

        // Fetch transfer request
        const [transferRequest] = await connection.query(
            `
            SELECT
                transfer_request_id,
                assignment_id,
                requested_by,
                to_user,
                quantity,
                status,
                same_group_transfer,
                source_holder_status,
                destination_holder_status
            FROM transfer_requests
            WHERE transfer_request_id = ?
            AND is_deleted = ?
            FOR UPDATE
            `,
            [transferRequestId, "no"]
        );

        if (transferRequest.length === 0) {

            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Transfer request not found.",
            });

        }

        const transfer = transferRequest[0];


        // Already rejected
        if (transfer.status === 0) {

            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Transfer request has already been rejected.",
            });

        }

        // Already completed
        if (transfer.status === 2) {

            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Transfer request has already been completed.",
            });

        }

        

        // Source holder approval required
        if (transfer.source_holder_status !== 1) {

            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Source Inventory Holder approval is pending.",
            });

        }

        // Different group transfer
        if (
            transfer.same_group_transfer === "no" &&
            transfer.destination_holder_status === 1
        ) {

            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Destination Inventory Holder has already approved this transfer.",
            });

        }

        // Fetch logged-in Inventory Holder's group
        const [loggedInHolder] = await connection.query(
            `
            SELECT
                id,
                group_id
            FROM users
            WHERE id = ?
            AND role = ?
            AND is_deleted = ?
            `,
            [
                approvedBy,
                "INVENTORY_HOLDER",
                "no",
            ]
        );

        if (loggedInHolder.length === 0) {

            await connection.rollback();

            return res.status(403).json({
                success: false,
                message: "Inventory Holder not found.",
            });

        }

        // Fetch destination user's group
        const [destinationUser] = await connection.query(
            `
            SELECT
                id,
                group_id
            FROM users
            WHERE id = ?
            AND is_deleted = ?
            `,
            [
                transfer.to_user,
                "no",
            ]
        );

        if (destinationUser.length === 0) {

            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Destination user not found.",
            });

        }

        // Authorize the Inventory Holder

        if (transfer.same_group_transfer === "yes") {

            const [requester] = await connection.query(
                `
                SELECT group_id
                FROM users
                WHERE id = ?
                `,
                [transfer.requested_by]
            );

            if (
                requester.length === 0 ||
                requester[0].group_id !== loggedInHolder[0].group_id
            ) {

                await connection.rollback();

                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to complete this transfer.",
                });

            }

        } else {

            if (
                destinationUser[0].group_id !==
                loggedInHolder[0].group_id
            ) {

                await connection.rollback();

                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to complete this transfer.",
                });

            }

        }

        // Fetch sender assignment
        const [assignment] = await connection.query(
            `
            SELECT
                assignment_id,
                inventory_id,
                user_id,
                quantity,
                status,
                is_deleted
            FROM asset_assignment
            WHERE assignment_id = ?
            AND is_deleted = ?
            FOR UPDATE
            `,
            [
                transfer.assignment_id,
                "no",
            ]
        );

        if (assignment.length === 0) {

            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Asset assignment not found.",
            });

        }

        const senderAssignment = assignment[0];

        if (senderAssignment.user_id !== transfer.requested_by) {

            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Transfer request does not match the assignment owner.",
            });

        }

        if (senderAssignment.quantity < transfer.quantity) {

            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Insufficient assigned quantity to complete transfer.",
            });

        }

        const remainingQuantity =
        senderAssignment.quantity - transfer.quantity;

        if (remainingQuantity > 0) {

            await connection.query(
                `
                UPDATE asset_assignment
                SET quantity = ?
                WHERE assignment_id = ?
                `,
                [
                    remainingQuantity,
                    senderAssignment.assignment_id,
                ]
            );

        }

        else {

            await connection.query(
                `
                UPDATE asset_assignment
                SET
                    quantity = 0,
                    is_deleted = ?
                WHERE assignment_id = ?
                `,
                [
                    "yes",
                    senderAssignment.assignment_id,
                ]
            );

        }

        // Check whether receiver already has this inventory
        const [receiverAssignment] = await connection.query(
            `
            SELECT
                assignment_id,
                quantity
            FROM asset_assignment
            WHERE user_id = ?
            AND inventory_id = ?
            AND is_deleted = ?
            FOR UPDATE
            `,
            [
                transfer.to_user,
                senderAssignment.inventory_id,
                "no",
            ]
        );

        if (receiverAssignment.length > 0) {

            // Receiver already has this asset
            await connection.query(
                `
                UPDATE asset_assignment
                SET quantity = quantity + ?
                WHERE assignment_id = ?
                `,
                [
                    transfer.quantity,
                    receiverAssignment[0].assignment_id,
                ]
            );

        } else {

            // Create a new assignment for the receiver
            await connection.query(
                `
                INSERT INTO asset_assignment
                (
                    inventory_id,
                    user_id,
                    quantity,
                    assigned_by,
                    assigned_date,
                    remarks,
                    status
                )
                VALUES (?, ?, ?, ?, CURDATE(), ?, ?)
                `,
                [
                    senderAssignment.inventory_id,
                    transfer.to_user,
                    transfer.quantity,
                    approvedBy,
                    "Transfer completed",
                    1
                ]
            );

        }

        // Record asset history

        //Source
        await connection.query(
            `
            INSERT INTO asset_history
            (
                inventory_id,
                performed_by,
                action,
                quantity,
                reference_table,
                reference_id,
                remarks
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [
                senderAssignment.inventory_id,
                transfer.requested_by,
                "TRANSFERRED",
                transfer.quantity,
                "transfer_requests",
                transfer.transfer_request_id,
                "Asset transferred successfully"
            ]
        );

        //Destination
        await connection.query(
            `
            INSERT INTO asset_history
            (
                inventory_id,
                performed_by,
                action,
                quantity,
                reference_table,
                reference_id,
                remarks
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [
                senderAssignment.inventory_id,
                transfer.to_user,
                "RECEIVED",
                transfer.quantity,
                "transfer_requests",
                transfer.transfer_request_id,
                "Asset received through transfer"
            ]
        );

        // Source Inventory Holder
        if (transfer.same_group_transfer === "no") {

            const [sourceHolder] = await connection.query(
                `
                SELECT id
                FROM users
                WHERE
                    group_id = (
                        SELECT group_id
                        FROM users
                        WHERE id = ?
                    )
                    AND role = 'INVENTORY_HOLDER'
                    AND is_deleted = 'no'
                LIMIT 1
                `,
                [transfer.requested_by]
            );

            if (
                sourceHolder.length > 0 &&
                sourceHolder[0].id !== approvedBy
            ) {

                await connection.query(
                    `
                    INSERT INTO asset_history
                    (
                        inventory_id,
                        performed_by,
                        action,
                        quantity,
                        reference_table,
                        reference_id,
                        remarks
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    `,
                    [
                        senderAssignment.inventory_id,
                        sourceHolder[0].id,
                        "TRANSFERRED",
                        transfer.quantity,
                        "transfer_requests",
                        transfer.transfer_request_id,
                        "Transfer completed from group"
                    ]
                );

            }

        }

        //IH
        await connection.query(
            `
            INSERT INTO asset_history
            (
                inventory_id,
                performed_by,
                action,
                quantity,
                reference_table,
                reference_id,
                remarks
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [
                senderAssignment.inventory_id,
                approvedBy,
                "TRANSFERRED",
                transfer.quantity,
                "transfer_requests",
                transfer.transfer_request_id,
                "Transfer received into group"
            ]
        );

        // Mark transfer as completed
        if (transfer.same_group_transfer === "yes") {

            // Destination approval was already recorded earlier.
            await connection.query(
                `
                UPDATE transfer_requests
                SET status = ?
                WHERE transfer_request_id = ?
                `,
                [
                    2,
                    transfer.transfer_request_id,
                ]
            );

        } else {

            // Record destination approval and complete the transfer.
            await connection.query(
                `
                UPDATE transfer_requests
                SET
                    destination_holder_status = ?,
                    destination_approved_at = NOW(),
                    status = ?
                WHERE transfer_request_id = ?
                `,
                [
                    1,
                    2,
                    transfer.transfer_request_id,
                ]
            );

        }

        await createNotification(
            connection,
            transfer.requested_by,
            "Transfer Completed",
            "Your transfer request has been completed successfully."
        );

        await connection.commit();

        return res.status(200).json({
            success: true,
            message: "Transfer completed successfully.",
        });

    } catch (error) {

        if (connection) {
            await connection.rollback();
        }

        console.error("Complete Transfer Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    } finally {

        if (connection) {
            connection.release();
        }

    }
};

exports.rejectTransferRequest = async (req, res) => {
    let connection;

    try {

        connection = await db.getConnection();
        await connection.beginTransaction();

        const { id } = req.params;

        const transferRequestId = Number(id);

        const approvedBy = req.user.id;

        // Validate ID
        if (!Number.isInteger(transferRequestId) || transferRequestId <= 0) {

            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Invalid transfer request ID.",
            });

        }

        // Fetch transfer request
        const [transferRequest] = await connection.query(
            `
            SELECT
                transfer_request_id,
                assignment_id,
                requested_by,
                to_user,
                quantity,
                status,
                same_group_transfer,
                source_holder_status,
                destination_holder_status
            FROM transfer_requests
            WHERE transfer_request_id = ?
            AND is_deleted = ?
            FOR UPDATE
            `,
            [transferRequestId, "no"]
        );

        if (transferRequest.length === 0) {

            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Transfer request not found.",
            });

        }

        const transfer = transferRequest[0];

        // Already rejected
        if (transfer.status === 0) {

            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Transfer request has already been rejected.",
            });

        }

        // Already completed
        if (transfer.status === 2) {

            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Transfer request has already been completed.",
            });

        }

        // Fetch logged-in Inventory Holder
        const [loggedInHolder] = await connection.query(
            `
            SELECT
                id,
                group_id
            FROM users
            WHERE id = ?
            AND role = ?
            AND is_deleted = ?
            `,
            [
                approvedBy,
                "INVENTORY_HOLDER",
                "no",
            ]
        );

        if (loggedInHolder.length === 0) {

            await connection.rollback();

            return res.status(403).json({
                success: false,
                message: "Inventory Holder not found.",
            });

        }

        // Fetch destination user
        const [destinationUser] = await connection.query(
            `
            SELECT
                id,
                group_id
            FROM users
            WHERE id = ?
            AND is_deleted = ?
            `,
            [
                transfer.to_user,
                "no",
            ]
        );

        if (destinationUser.length === 0) {

            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Destination user not found.",
            });

        }

        // Authorization
        if (transfer.same_group_transfer === "yes") {

            const [requester] = await connection.query(
                `
                SELECT group_id
                FROM users
                WHERE id = ?
                `,
                [transfer.requested_by]
            );

            if (
                requester.length === 0 ||
                requester[0].group_id !== loggedInHolder[0].group_id
            ) {

                await connection.rollback();

                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to reject this transfer.",
                });

            }

        } else {

            if (
                destinationUser[0].group_id !==
                loggedInHolder[0].group_id
            ) {

                await connection.rollback();

                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to reject this transfer.",
                });

            }

        }

        // Fetch inventory id for history
        const [assignment] = await connection.query(
            `
            SELECT inventory_id
            FROM asset_assignment
            WHERE assignment_id = ?
            `,
            [transfer.assignment_id]
        );

        if (assignment.length === 0) {

            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Assignment not found.",
            });

        }

        // Reject transfer
        await connection.query(
            `
            UPDATE transfer_requests
            SET status = ?
            WHERE transfer_request_id = ?
            `,
            [
                0,
                transfer.transfer_request_id,
            ]
        );

        // Asset History
        await connection.query(
            `
            INSERT INTO asset_history
            (
                inventory_id,
                performed_by,
                action,
                quantity,
                reference_table,
                reference_id,
                remarks
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [
                assignment[0].inventory_id,
                approvedBy,
                "REJECTED",
                transfer.quantity,
                "transfer_requests",
                transfer.transfer_request_id,
                "Transfer request rejected",
            ]
        );

        await createNotification(
            connection,
            transfer.requested_by,
            "Transfer Rejected",
            "Your transfer request has been rejected."
        );

        await connection.commit();

        return res.status(200).json({
            success: true,
            message: "Transfer request rejected successfully.",
        });

    } catch (error) {

        if (connection) {
            await connection.rollback();
        }

        console.error("Reject Transfer Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    } finally {

        if (connection) {
            connection.release();
        }

    }
};