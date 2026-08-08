const db = require("../config/db");

exports.createGroup = async (req, res) => {
    try {
        const { group_name, description, status } = req.body;

        const trimmedGroupName = group_name?.trim();

        // Validate required fields
        if (!trimmedGroupName) {
            return res.status(400).json({
                success: false,
                message: "Group name is required.",
            });
        }

        // Check duplicate group name
        const [existingGroup] = await db.query(
            `
            SELECT group_id
            FROM \`groups\`
            WHERE group_name = ?
            AND is_deleted = ?
            `,
            [trimmedGroupName, "no"]
        );

        if (existingGroup.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Group name already exists.",
            });
        }

        // Insert group
        const [result] = await db.query(
            `
            INSERT INTO \`groups\`
            (
                group_name,
                description,
                status
            )
            VALUES (?, ?, ?)
            `,
            [
                trimmedGroupName,
                description || null,
                status ?? 1,
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(500).json({
                success: false,
                message: "Failed to create group.",
            });
        }

        return res.status(201).json({
            success: true,
            message: "Group created successfully.",
            groupID: result.insertId,
        });

    } catch (error) {
        console.error("Create Group Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

exports.getAllGroups = async (req, res) => {
    try {
        const [groups] = await db.query(`
           SELECT
            g.group_id,
            g.group_name,
            g.description,
            g.status,
            g.created_at,
            COUNT(u.id) AS members
        FROM \`groups\` g

        LEFT JOIN users u
            ON g.group_id = u.group_id

        WHERE
            g.is_deleted = 'no'
            AND (
                u.is_deleted = 'no'
                OR u.id IS NULL
            )

        GROUP BY
            g.group_id,
            g.group_name,
            g.description,
            g.status,
            g.created_at

        ORDER BY
            g.created_at DESC;
        `);

        return res.status(200).json({
            success: true,
            count: groups.length,
            data: groups,
        });

    } catch (error) {
        console.error("Get Groups Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

exports.getGroupById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid group ID.",
            });
        }

        const [groups] = await db.query(
            `
            SELECT
                group_id,
                group_name,
                description,
                status,
                created_at
            FROM \`groups\`
            WHERE group_id = ? AND is_deleted = ?
            `,
            [id, "no"]
        );

        if (groups.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Group not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: groups[0],
        });

    } catch (error) {
        console.error("Get Group By ID Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

exports.updateGroup = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid group ID.",
            });
        }

        const {
            group_name,
            description,
            status,
        } = req.body;

        const trimmedGroupName = group_name?.trim();

        // Required field validation
        if (!trimmedGroupName) {
            return res.status(400).json({
                success: false,
                message: "Group name is required.",
            });
        }

        const numericStatus = Number(status);

        if (![0, 1].includes(numericStatus)) {
            return res.status(400).json({
                success: false,
                message: "Status must be either 0 or 1.",
            });
        }

        // Check if group exists
        const [existingGroup] = await db.query(
            `
            SELECT group_id
            FROM \`groups\`
            WHERE group_id = ?
            AND is_deleted = ?
            `,
            [id, "no"]
        );

        if (existingGroup.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Group not found.",
            });
        }

        // Check duplicate group name
        const [groupExists] = await db.query(
            `
            SELECT group_id
            FROM \`groups\`
            WHERE group_name = ?
            AND group_id <> ?
            AND is_deleted = ?
            `,
            [trimmedGroupName, id, "no"]
        );

        if (groupExists.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Group name already exists.",
            });
        }

        // Update group
        const [result] = await db.query(
            `
            UPDATE \`groups\`
            SET
                group_name = ?,
                description = ?,
                status = ?
            WHERE group_id = ?
            AND is_deleted = ?
            `,
            [
                trimmedGroupName,
                description,
                numericStatus,
                id,
                "no",
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Group not found or already deleted.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Group updated successfully.",
        });

    } catch (error) {
        console.error("Update Group Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

exports.deleteGroup = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid group ID.",
            });
        }

        // Check if group exists
        const [existingGroup] = await db.query(
            `
            SELECT group_id
            FROM \`groups\`
            WHERE group_id = ?
            AND is_deleted = ?
            `,
            [id, "no"]
        );

        if (existingGroup.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Group not found.",
            });
        }

        // Soft delete
        const [result] = await db.query(
            `
            UPDATE \`groups\`
            SET is_deleted = ?
            WHERE group_id = ?
            AND is_deleted = ?
            `,
            ["yes", id, "no"]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Group not found or already deleted.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Group deleted successfully.",
        });

    } catch (error) {
        console.error("Delete Group Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};