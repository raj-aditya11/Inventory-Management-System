const db = require("../config/db");

exports.getAllCadres = async (req, res) => {
    try {

        const [cadres] = await db.query(
            `
            SELECT
                cadre_id,
                cadre_name
            FROM cadres
            WHERE status = 1
            ORDER BY cadre_name
            `
        );

        return res.status(200).json({
            success: true,
            count: cadres.length,
            data: cadres,
        });

    } catch (error) {

        console.error("Get Cadres Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }
};