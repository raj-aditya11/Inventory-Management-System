const db = require("../config/db");

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

        // Insert request
        const [result] = await db.query(
            `
            INSERT INTO transfer_requests
            (
                assignment_id,
                requested_by,
                to_user,
                quantity,
                reason
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                assignmentId,
                requestedBy,
                toUser,
                transferQuantity,
                trimmedReason,
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Transfer request created successfully.",
            transferRequestId: result.insertId,
            sameGroup:
                requester[0].group_id === destinationUser[0].group_id,
        });

    } catch (error) {

        console.error("Create Transfer Request Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }
};