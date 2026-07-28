require("dotenv").config();

const bcrypt = require("bcrypt");
const db = require("./config/db");

async function seedAdmin() {
    try {
        // Check if an admin already exists
        const [existingAdmin] = await db.query(
            "SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1"
        );

        if (existingAdmin.length > 0) {
            console.log("✅ Admin already exists.");
            process.exit();
        }

        // Hash password
        const hashedPassword = await bcrypt.hash("admin123", 10);

        // Insert admin
        await db.query(
            `INSERT INTO users
            (
                first_name,
                last_name,
                role,
                user_name,
                password,
                status,
                is_deleted
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                "System",
                "Administrator",
                "ADMIN",
                "admin",
                hashedPassword,
                1,
                null,
            ]
        );

        console.log("✅ Admin user created successfully!");
        console.log("Username: admin");
        console.log("Password: admin123");

        process.exit();

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

seedAdmin();