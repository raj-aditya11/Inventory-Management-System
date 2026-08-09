const db = require("./config/db");

const seedMasterData = async () => {

    try {

        // Cadre
        await db.query(
            `
            INSERT INTO cadres
            (
                cadre_name,
                description,
                status
            )
            VALUES (?, ?, ?)
            `,
            [
                "ABC",
                "Dummy cadre",
                1
            ]
        );

        // Designations
        await db.query(
            `
            INSERT INTO designations
            (
                designation_name,
                description,
                status
            )
            VALUES
                (?, ?, ?),
                (?, ?, ?),
                (?, ?, ?)
            `,
            [
                "XYZ",
                "Dummy designation",
                1,

                "PQR",
                "Dummy designation",
                1,

                "IJK",
                "Dummy designation",
                1
            ]
        );

        // Internal Designations
        await db.query(
            `
            INSERT INTO internal_designations
            (
                designation_name,
                description,
                status
            )
            VALUES
                (?, ?, ?),
                (?, ?, ?),
                (?, ?, ?)
            `,
            [
                "Administrative",
                "Administrative role purpose",
                1,

                "Inventory Management",
                "Inventory management role purpose",
                1,

                "General User",
                "General user role purpose",
                1
            ]
        );

        console.log("Master data seeded successfully.");

    } catch (error) {

        console.error(
            "Error seeding master data:",
            error
        );

    } finally {

        await db.end();

    }

};

seedMasterData();