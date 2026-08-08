const db = require("../config/db");

exports.getAllInternalDesignations = async (req, res) => {
    try {

        const [designations] = await db.query(
            `
            SELECT
                internal_desig_id,
                designation_name
            FROM internal_designations
            WHERE status = 1
            ORDER BY designation_name
            `
        );

        return res.status(200).json({
            success: true,
            count: designations.length,
            data: designations,
        });

    } catch (error) {

        console.error("Get Internal Designations Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }
};