const db = require("../config/db");
const {createNotification} = require("./notificationController");

exports.createAssignment = async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        const {
            inventory_id,
            user_id,
            quantity,
            assigned_by,
            assigned_date,
            remarks,
            status,
        } = req.body;

        // Required field validation
        if (
            !inventory_id ||
            !user_id ||
            !quantity ||
            !assigned_by ||
            !assigned_date
        ) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided.",
            });
        }

        // Convert numeric values
        const inventoryId = Number(inventory_id);
        const userId = Number(user_id);
        const assignedBy = Number(assigned_by);
        const assignedQuantity = Number(quantity);
        const numericStatus = Number(status);

        // Trim remarks
        const trimmedRemarks = remarks?.trim() || null;

        // Validate IDs
        if (!Number.isInteger(inventoryId) || inventoryId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid inventory ID.",
            });
        }

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID.",
            });
        }

        if (!Number.isInteger(assignedBy) || assignedBy <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid Inventory Holder ID.",
            });
        }

        if (!Number.isInteger(assignedQuantity) || assignedQuantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be greater than 0.",
            });
        }

        if (![0, 1].includes(numericStatus)) {
            return res.status(400).json({
                success: false,
                message: "Status must be either 0 or 1.",
            });
        }

        // Check inventory exists
        const [inventory] = await connection.query(
            `
            SELECT
                i.inventory_id,
                i.quantity_available,
                a.asset_name
            FROM inventory i
            INNER JOIN assets a
                ON i.asset_id = a.asset_id
            WHERE i.inventory_id = ?
            AND i.is_deleted = ?
            `,
            [inventoryId, "no"]
        );

        if (inventory.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Inventory not found.",
            });
        }

        const availableQuantity = inventory[0].quantity_available;
        const assetName = inventory[0].asset_name;

        if (assignedQuantity > availableQuantity) {
            return res.status(400).json({
                success: false,
                message: "Assigned quantity exceeds available inventory.",
            });
        }

        // Check user exists
        const [user] = await connection.query(
            `
            SELECT id
            FROM users
            WHERE id = ?
            AND is_deleted = ?
            `,
            [userId, "no"]
        );

        if (user.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Check Inventory Holder exists
        const [inventoryHolder] = await connection.query(
            `
            SELECT id
            FROM users
            WHERE id = ?
            AND role = ?
            AND is_deleted = ?
            `,
            [assignedBy, "INVENTORY_HOLDER", "no"]
        );

        if (inventoryHolder.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Inventory Holder not found.",
            });
        }

        // Insert assignment
        const [result] = await connection.query(
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
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [
                inventoryId,
                userId,
                assignedQuantity,
                assignedBy,
                assigned_date,
                trimmedRemarks,
                numericStatus,
            ]
        );

        // Reduce available quantity
        const [updateResult] = await connection.query(
            `
            UPDATE inventory
            SET quantity_available = quantity_available - ?
            WHERE inventory_id = ?
            `,
            [
                assignedQuantity,
                inventoryId,
            ]
        );

        if (updateResult.affectedRows === 0) {
            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Inventory not found.",
            });
        }

        await createNotification(
            connection,
            userId,
            "Asset Assigned",
            `You have been assigned ${assignedQuantity} ${assetName}(s).`
        );

        await connection.commit();

        return res.status(201).json({
            success: true,
            message: "Asset assigned successfully.",
            assignmentId: result.insertId,
        });

    } catch (error) {

        if (connection) {
            await connection.rollback();
        }

        console.error("Create Assignment Error:", error);

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

exports.getAllAssignments = async (req, res) => {
    try {

        const [assignments] = await db.query(
            `
            SELECT
                aa.assignment_id,
                a.asset_name,
                u.user_name AS assigned_to,
                ih.user_name AS assigned_by,
                aa.quantity,
                aa.assigned_date,
                aa.remarks,
                aa.status
            FROM asset_assignment aa

            INNER JOIN inventory i
                ON aa.inventory_id = i.inventory_id

            INNER JOIN assets a
                ON i.asset_id = a.asset_id

            INNER JOIN users u
                ON aa.user_id = u.id

            INNER JOIN users ih
                ON aa.assigned_by = ih.id

            WHERE aa.is_deleted = ?

            ORDER BY aa.created_at DESC
            `,
            ["no"]
        );

        return res.status(200).json({
            success: true,
            count: assignments.length,
            data: assignments,
        });

    } catch (error) {

        console.error("Get Assignments Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }
};

exports.getMyAssignments = async (req, res) => {
    try {

        const userId = req.user.id;

        const [assignments] = await db.query(
            `
            SELECT
                aa.assignment_id,
                aa.inventory_id,
                i.sr_no,
                i.ledger_number,
                a.asset_name,
                aa.quantity,
                i.unit,
                aa.assigned_date,
                aa.remarks,
                aa.status
            FROM asset_assignment aa

            INNER JOIN inventory i
                ON aa.inventory_id = i.inventory_id

            INNER JOIN assets a
                ON i.asset_id = a.asset_id

            WHERE aa.user_id = ?
            AND aa.is_deleted = 'no'

            ORDER BY aa.assigned_date DESC
            `,
            [userId]
        );

        return res.status(200).json({
            success: true,
            count: assignments.length,
            data: assignments,
        });

    } catch (error) {

        console.error("Get My Assignments Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }
};

exports.getAssignmentById = async (req, res) => {
    try {

        const assignmentId = Number(req.params.id);

        // Validate ID
        if (!Number.isInteger(assignmentId) || assignmentId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid assignment ID.",
            });
        }

        const [assignment] = await db.query(
            `
            SELECT
                aa.assignment_id,
                aa.inventory_id,
                a.asset_name,
                aa.user_id,
                u.user_name AS assigned_to,
                aa.assigned_by,
                ih.user_name AS assigned_by_name,
                aa.quantity,
                aa.assigned_date,
                aa.remarks,
                aa.status,
                aa.created_at
            FROM asset_assignment aa

            INNER JOIN inventory i
                ON aa.inventory_id = i.inventory_id

            INNER JOIN assets a
                ON i.asset_id = a.asset_id

            INNER JOIN users u
                ON aa.user_id = u.id

            INNER JOIN users ih
                ON aa.assigned_by = ih.id

            WHERE aa.assignment_id = ?
            AND aa.is_deleted = ?
            `,
            [assignmentId, "no"]
        );

        if (assignment.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Assignment not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: assignment[0],
        });

    } catch (error) {

        console.error("Get Assignment By ID Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }
};

exports.updateAssignment = async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        const assignmentId = Number(req.params.id);

        // Validate assignment ID
        if (!Number.isInteger(assignmentId) || assignmentId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid assignment ID.",
            });
        }

        const {
            user_id,
            quantity,
            assigned_by,
            assigned_date,
            remarks,
            status,
        } = req.body;

        // Required field validation
        if (
            !user_id ||
            !quantity ||
            !assigned_by ||
            !assigned_date
        ) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided.",
            });
        }

        const userId = Number(user_id);
        const assignedQuantity = Number(quantity);
        const assignedBy = Number(assigned_by);
        const numericStatus = Number(status);

        const trimmedRemarks = remarks?.trim() || null;

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID.",
            });
        }

        if (!Number.isInteger(assignedQuantity) || assignedQuantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be greater than 0.",
            });
        }

        if (!Number.isInteger(assignedBy) || assignedBy <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid Inventory Holder ID.",
            });
        }

        if (![0, 1].includes(numericStatus)) {
            return res.status(400).json({
                success: false,
                message: "Status must be either 0 or 1.",
            });
        }

        // Check assignment exists
        const [existingAssignment] = await connection.query(
            `
            SELECT
                inventory_id,
                quantity
            FROM asset_assignment
            WHERE assignment_id = ?
            AND is_deleted = ?
            `,
            [assignmentId, "no"]
        );

        if (existingAssignment.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Assignment not found.",
            });
        }

        const inventoryId = existingAssignment[0].inventory_id;
        const oldQuantity = existingAssignment[0].quantity;

        // Check inventory
        const [inventory] = await connection.query(
            `
            SELECT quantity_available
            FROM inventory
            WHERE inventory_id = ?
            AND is_deleted = ?
            `,
            [inventoryId, "no"]
        );

        if (inventory.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Inventory not found.",
            });
        }

        const availableQuantity = inventory[0].quantity_available;

        // Check if new quantity is possible
        if (assignedQuantity > availableQuantity + oldQuantity) {
            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Assigned quantity exceeds available inventory.",
            });
        }

        // Check user
        const [user] = await connection.query(
            `
            SELECT id
            FROM users
            WHERE id = ?
            AND is_deleted = ?
            `,
            [userId, "no"]
        );

        if (user.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Check Inventory Holder
        const [inventoryHolder] = await connection.query(
            `
            SELECT id
            FROM users
            WHERE id = ?
            AND role = ?
            AND is_deleted = ?
            `,
            [assignedBy, "INVENTORY_HOLDER", "no"]
        );

        if (inventoryHolder.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Inventory Holder not found.",
            });
        }

        // Update assignment
        const [result] = await connection.query(
            `
            UPDATE asset_assignment
            SET
                user_id = ?,
                quantity = ?,
                assigned_by = ?,
                assigned_date = ?,
                remarks = ?,
                status = ?
            WHERE assignment_id = ?
            `,
            [
                userId,
                assignedQuantity,
                assignedBy,
                assigned_date,
                trimmedRemarks,
                numericStatus,
                assignmentId,
            ]
        );

        if (result.affectedRows === 0) {
            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Assignment not found.",
            });
        }

        const difference = assignedQuantity - oldQuantity;

        // Update inventory
        await connection.query(
            `
            UPDATE inventory
            SET quantity_available = quantity_available - ?
            WHERE inventory_id = ?
            `,
            [
                difference,
                inventoryId,
            ]
        );

        await connection.commit();

        return res.status(200).json({
            success: true,
            message: "Assignment updated successfully.",
        });

    } catch (error) {

        if (connection) {
            await connection.rollback();
        }

        console.error("Update Assignment Error:", error);

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

exports.deleteAssignment = async (req, res) => {
    let connection;

    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        const assignmentId = Number(req.params.id);

        // Validate Assignment ID
        if (!Number.isInteger(assignmentId) || assignmentId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid assignment ID.",
            });
        }

        // Check assignment exists
        const [assignment] = await connection.query(
            `
            SELECT
                inventory_id,
                quantity
            FROM asset_assignment
            WHERE assignment_id = ?
            AND is_deleted = ?
            `,
            [assignmentId, "no"]
        );

        if (assignment.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Assignment not found.",
            });
        }

        const inventoryId = assignment[0].inventory_id;
        const assignedQuantity = assignment[0].quantity;

        // Return quantity back to inventory
        const [inventoryResult] = await connection.query(
            `
            UPDATE inventory
            SET quantity_available = quantity_available + ?
            WHERE inventory_id = ?
            AND is_deleted = ?
            `,
            [
                assignedQuantity,
                inventoryId,
                "no",
            ]
        );

        if (inventoryResult.affectedRows === 0) {
            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Inventory not found.",
            });
        }

        // Soft delete assignment
        const [result] = await connection.query(
            `
            UPDATE asset_assignment
            SET is_deleted = ?
            WHERE assignment_id = ?
            AND is_deleted = ?
            `,
            [
                "yes",
                assignmentId,
                "no",
            ]
        );

        if (result.affectedRows === 0) {
            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Assignment not found.",
            });
        }

        await connection.commit();

        return res.status(200).json({
            success: true,
            message: "Assignment deleted successfully.",
        });

    } catch (error) {

        if (connection) {
            await connection.rollback();
        }

        console.error("Delete Assignment Error:", error);

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