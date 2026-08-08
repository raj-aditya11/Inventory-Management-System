const db = require("../config/db");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
    try {
        const {
            first_name,
            middle_name,
            last_name,
            gen,
            dob,
            mobile_no,
            email_id,
            cadre_id,
            desig_id,
            internal_desig_id,
            role,
            telephone_no,
            user_name,
            password,
            is_gazetted,
            user_type,
            group_id,
        } = req.body;

        // Required fields
        if (!first_name || !user_name || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "First name, username, password and role are required.",
            });
        }

        // Check username
        const [existingUsername] = await db.query(
            "SELECT id FROM users WHERE user_name = ?",
            [user_name]
        );

        if (existingUsername.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Username already exists.",
            });
        }

        // Check email
        if (email_id) {
            const [existingEmail] = await db.query(
                "SELECT id FROM users WHERE email_id = ?",
                [email_id]
            );

            if (existingEmail.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: "Email already exists.",
                });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            `
            INSERT INTO users (
                first_name,
                middle_name,
                last_name,
                gen,
                dob,
                mobile_no,
                email_id,
                cadre_id,
                desig_id,
                internal_desig_id,
                role,
                telephone_no,
                user_name,
                password,
                is_gazetted,
                user_type,
                group_id
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                first_name,
                middle_name || null,
                last_name || null,
                gen || null,
                dob || null,
                mobile_no || null,
                email_id || null,
                cadre_id || null,
                desig_id || null,
                internal_desig_id || null,
                role,
                telephone_no || null,
                user_name,
                hashedPassword,
                is_gazetted || null,
                user_type || null,
                group_id || null,
            ]
        );

        return res.status(201).json({
            success: true,
            message: "User created successfully.",
            data: {
                id: result.insertId,
                first_name,
                user_name,
                role,
            },
        });

    } catch (error) {
        console.error("Create User Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

exports.getAllUsers = async (req, res) => {
    const userId = req.user.id;
    const role = req.user.role;
    try {
        let query = "";
        let params = [];

        if (role === "ADMIN") {

            query = `
                SELECT
                    id,
                    first_name,
                    middle_name,
                    last_name,
                    gen,
                    dob,
                    mobile_no,
                    email_id,
                    cadre_id,
                    desig_id,
                    internal_desig_id,
                    role,
                    telephone_no,
                    user_name,
                    status,
                    is_gazetted,
                    created_at,
                    updated_at,
                    user_type,
                    group_id
                FROM users
                WHERE is_deleted = 'no'
                ORDER BY created_at DESC
            `;

        } else if (role === "INVENTORY_HOLDER") {

            query = `
                SELECT
                    id,
                    first_name,
                    middle_name,
                    last_name,
                    gen,
                    dob,
                    mobile_no,
                    email_id,
                    cadre_id,
                    desig_id,
                    internal_desig_id,
                    role,
                    telephone_no,
                    user_name,
                    status,
                    is_gazetted,
                    created_at,
                    updated_at,
                    user_type,
                    group_id
                FROM users
                WHERE
                    group_id = (
                        SELECT group_id
                        FROM users
                        WHERE id = ?
                    )
                    AND is_deleted = 'no'
                ORDER BY created_at DESC
            `;

            params = [userId];

        } else if (role === "USER") {

            query = `
                SELECT
                    id,
                    first_name,
                    middle_name,
                    last_name,
                    gen,
                    dob,
                    mobile_no,
                    email_id,
                    cadre_id,
                    desig_id,
                    internal_desig_id,
                    role,
                    telephone_no,
                    user_name,
                    status,
                    is_gazetted,
                    created_at,
                    updated_at,
                    user_type,
                    group_id
                FROM users
                WHERE
                    role = 'USER'
                    AND status = 1
                    AND is_deleted = 'no'
                    AND id <> ?
                ORDER BY first_name
            `;

            params = [userId];

        } else {

            return res.status(403).json({
                success: false,
                message: "Unauthorized access."
            });

        }

        const [users] = await db.query(query, params);

        return res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });

    } catch (error) {
        console.error("Get Users Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

exports.getMyProfile = async (req, res) => {

    try {

        const userId = req.user.id;

        const [users] = await db.query(
            `
            SELECT
                u.id,
                u.first_name,
                u.middle_name,
                u.last_name,
                u.user_name,
                u.email_id,
                u.mobile_no,
                u.role,
                u.status,

                g.group_name,

                c.cadre_name,

                d.designation_name,

                id.designation_name AS internal_designation

            FROM users u

            LEFT JOIN \`groups\` g
                ON u.group_id = g.group_id

            LEFT JOIN cadres c
                ON u.cadre_id = c.cadre_id

            LEFT JOIN designations d
                ON u.desig_id = d.desig_id

            LEFT JOIN internal_designations id
                ON u.internal_desig_id = id.internal_desig_id

            WHERE
                u.id = ?
                AND u.is_deleted = 'no'
            `,
            [userId]
        );

        if (users.length === 0) {

            return res.status(404).json({
                success: false,
                message: "User not found.",
            });

        }

        return res.status(200).json({
            success: true,
            data: users[0],
        });

    } catch (error) {

        console.error("Get Profile Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }

};

exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID.",
            });
        }

        const [users] = await db.query(
            `
            SELECT
                id,
                first_name,
                middle_name,
                last_name,
                gen,
                dob,
                mobile_no,
                email_id,
                cadre_id,
                desig_id,
                internal_desig_id,
                role,
                telephone_no,
                user_name,
                status,
                is_gazetted,
                created_at,
                updated_at,
                user_type,
                group_id
            FROM users
            WHERE id = ? AND is_deleted = ?
            `,
            [id, "no"]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: users[0],
        });

    } catch (error) {
        console.error("Get User By ID Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID.",
            });
        }

        const {
            first_name,
            middle_name,
            last_name,
            gen,
            dob,
            mobile_no,
            email_id,
            cadre_id,
            desig_id,
            internal_desig_id,
            role,
            telephone_no,
            user_name,
            status,
            is_gazetted,
            user_type,
            group_id,
        } = req.body;

        // Required field validation
        if (!first_name || !user_name || !role) {
            return res.status(400).json({
                success: false,
                message: "First name, username and role are required.",
            });
        }

        // Check if user exists
        const [existingUser] = await db.query(
            `
            SELECT id
            FROM users
            WHERE id = ?
            AND is_deleted = ?
            `,
            [id, "no"]
        );

        if (existingUser.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Check duplicate username
        const [usernameExists] = await db.query(
            `
            SELECT id
            FROM users
            WHERE user_name = ?
            AND id <> ?
            AND is_deleted = ?
            `,
            [user_name, id, "no"]
        );

        if (usernameExists.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Username already exists.",
            });
        }

        // Check duplicate email
        const [emailExists] = await db.query(
            `
            SELECT id
            FROM users
            WHERE email_id = ?
            AND id <> ?
            AND is_deleted = ?
            `,
            [email_id, id, "no"]
        );

        if (emailExists.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Email already exists.",
            });
        }

        // Update user
        const [result] = await db.query(
            `
            UPDATE users
            SET
                first_name = ?,
                middle_name = ?,
                last_name = ?,
                gen = ?,
                dob = ?,
                mobile_no = ?,
                email_id = ?,
                cadre_id = ?,
                desig_id = ?,
                internal_desig_id = ?,
                role = ?,
                telephone_no = ?,
                user_name = ?,
                status = ?,
                is_gazetted = ?,
                user_type = ?,
                group_id = ?
            WHERE id = ?
            AND is_deleted = ?
            `,
            [
                first_name,
                middle_name,
                last_name,
                gen,
                dob,
                mobile_no,
                email_id,
                cadre_id,
                desig_id,
                internal_desig_id,
                role,
                telephone_no,
                user_name,
                status,
                is_gazetted,
                user_type,
                group_id,
                id,
                "no",
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found or already deleted.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User updated successfully.",
        });

    } catch (error) {
        console.error("Update User Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID.",
            });
        }

        // Check if user exists
        const [existingUser] = await db.query(
            `
            SELECT id
            FROM users
            WHERE id = ?
            AND is_deleted = ?
            `,
            [id, "no"]
        );

        if (existingUser.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Prevent self delete
        if (Number(req.user.id) === Number(id)) {
            return res.status(400).json({
                success: false,
                message: "You cannot delete your own account."
            });
        }

        // Soft delete
        const [result] = await db.query(
            `
            UPDATE users
            SET is_deleted = ?
            WHERE id = ?
            AND is_deleted = ?
            `,
            ["yes", id, "no"]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found or already deleted.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully.",
        });

    } catch (error) {
        console.error("Delete User Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};