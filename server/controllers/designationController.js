const db = require("../config/db");

exports.getAllDesignations = async (req, res) => {
    try {

        const [designations] = await db.query(
            `
            SELECT
                desig_id,
                designation_name
            FROM designations
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

        console.error("Get Designations Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }
};