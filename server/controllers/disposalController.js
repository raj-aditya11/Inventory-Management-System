const db = require("../config/db");
const ExcelJS = require("exceljs");

exports.disposeAsset = async (req, res) => {
    let connection;

    try {

        connection = await db.getConnection();
        await connection.beginTransaction();

        const { assignment_id, quantity, reason, remarks } = req.body;
        console.log("Request body:", req.body);

        const disposedBy = req.user.id;
        

        // Validate input
        if (
            !assignment_id ||
            !quantity ||
            quantity <= 0 ||
            !reason
        ) {

            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Assignment ID, quantity and reason are required.",
            });

        }

        // Fetch assignment
        const [assignment] = await connection.query(
            `
            SELECT
                assignment_id,
                inventory_id,
                user_id,
                quantity,
                is_deleted
            FROM asset_assignment
            WHERE assignment_id = ?
            AND is_deleted = ?
            FOR UPDATE
            `,
            [
                assignment_id,
                "no",
            ]
        );
        console.log("Fetched assignment:", assignment);

        if (assignment.length === 0) {

            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Assignment not found.",
            });

        }


        const currentAssignment = assignment[0];

        console.log("req.user:", req.user);
        console.log("disposedBy:", disposedBy);
        console.log("assignment user:", currentAssignment.user_id);
        console.log("equal?", currentAssignment.user_id === disposedBy);
        console.log("typeof disposedBy:", typeof disposedBy);
        console.log("typeof assignment user:", typeof currentAssignment.user_id);

        // Authorization
        if (currentAssignment.user_id !== disposedBy) {

            await connection.rollback();

            return res.status(403).json({
                success: false,
                message: "You can only dispose your own assigned assets.",
            });

        }

        // Validate quantity
        if (quantity > currentAssignment.quantity) {

            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Disposal quantity exceeds assigned quantity.",
            });

        }

        // Fetch inventory
        const [inventory] = await connection.query(
            `
            SELECT
                inventory_id,
                quantity_available,
                quantity_disposed
            FROM inventory
            WHERE inventory_id = ?
            FOR UPDATE
            `,
            [
                currentAssignment.inventory_id,
            ]
        );

        if (inventory.length === 0) {

            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Inventory record not found.",
            });

        }

        const inventoryRecord = inventory[0];

        if (quantity > inventoryRecord.quantity_available) {

            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Insufficient quantity available in inventory."
            });

        }

        // Update assignment
        const remainingQuantity =
            currentAssignment.quantity - quantity;

        if (remainingQuantity > 0) {

            await connection.query(
                `
                UPDATE asset_assignment
                SET quantity = ?
                WHERE assignment_id = ?
                `,
                [
                    remainingQuantity,
                    assignment_id,
                ]
            );

        } else {

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
                    assignment_id,
                ]
            );

        }

        // Update inventory
        await connection.query(
            `
            UPDATE inventory
            SET
                quantity_disposed = quantity_disposed + ?
            WHERE inventory_id = ?
            `,
            [
                quantity,
                currentAssignment.inventory_id,
            ]
        );

        // Insert disposal record
        const [result] = await connection.query(
            `
            INSERT INTO asset_disposal
            (
                assignment_id,
                disposed_by,
                quantity,
                reason,
                remarks
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                assignment_id,
                disposedBy,
                quantity,
                reason,
                remarks || null,
            ]
        );

        const disposalId = result.insertId;

        // Insert asset history
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
                currentAssignment.inventory_id,
                disposedBy,
                "DISPOSED",
                quantity,
                "asset_disposal",
                disposalId,
                remarks || reason,
            ]
        );

        await connection.commit();

        return res.status(200).json({
            success: true,
            message: "Asset disposed successfully.",
        });

    } catch (error) {

        if (connection) {
            await connection.rollback();
        }

        console.error("Dispose Asset Error:", error);

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

exports.getDisposals = async (req, res) => {

    try {

        const userId = req.user.id;
        const role = req.user.role;

        const query = `
            SELECT
                ad.disposal_id,
                ad.assignment_id,
                ad.disposed_by,

                CONCAT_WS(
                    ' ',
                    u.first_name,
                    u.middle_name,
                    u.last_name
                ) AS disposed_by_name,

                ad.quantity,
                ad.reason,
                ad.remarks,
                ad.disposed_at,

                aa.inventory_id,

                i.ledger_number,

                i.sr_no,

                i.unit,

                a.asset_name

            FROM asset_disposal ad

            INNER JOIN asset_assignment aa
                ON ad.assignment_id = aa.assignment_id

            INNER JOIN inventory i
                ON aa.inventory_id = i.inventory_id

            INNER JOIN assets a
                ON i.asset_id = a.asset_id

            INNER JOIN users u
                ON ad.disposed_by = u.id

            WHERE
                ad.disposed_by = ?
                AND ad.is_deleted = 'no'

            ORDER BY ad.disposed_at DESC
        `;

        const params = [userId];

        const [disposals] = await db.query(query, params);

        return res.status(200).json({
            success: true,
            count: disposals.length,
            disposals
        });

    } catch (error) {

        console.error("Get Disposals Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

exports.exportDisposalList = async (req, res) => {

    try {

        const userId = req.user.id;

        const [disposals] = await db.query(
            `
            SELECT
                ad.disposal_id,
                ad.quantity,
                ad.reason,
                ad.remarks,
                ad.disposed_at,

                i.sr_no,
                i.ledger_number,
                i.purchase_cost,
                i.purchase_date,
                i.unit,

                a.asset_name

            FROM asset_disposal ad

            INNER JOIN asset_assignment aa
                ON ad.assignment_id = aa.assignment_id

            INNER JOIN inventory i
                ON aa.inventory_id = i.inventory_id

            INNER JOIN assets a
                ON i.asset_id = a.asset_id

            INNER JOIN users u
                ON ad.disposed_by = u.id

            INNER JOIN users holder
                ON holder.id = ?

            WHERE
                ad.is_deleted = 'no'
                AND u.group_id = holder.group_id

            ORDER BY ad.disposed_at ASC
            `,
            [userId]
        );

        const workbook = new ExcelJS.Workbook();

        const worksheet = workbook.addWorksheet(
            "List of Items for Disposal"
        );

        /*
         * Title
         */

        worksheet.mergeCells("A1:M1");

        const titleCell = worksheet.getCell("A1");

        titleCell.value =
            "CENTRE FOR FIRE, EXPLOSIVE ENVIRONMENT SAFETY, DELHI - 110054";

        titleCell.font = {
            bold: true,
            size: 14,
        };

        titleCell.alignment = {
            horizontal: "center",
            vertical: "middle",
        };

        worksheet.mergeCells("A2:M2");

        const subtitleCell = worksheet.getCell("A2");

        subtitleCell.value = "LIST OF ITEMS FOR DISPOSAL";

        subtitleCell.font = {
            bold: true,
            size: 13,
        };

        subtitleCell.alignment = {
            horizontal: "center",
            vertical: "middle",
        };

        /*
         * Headers
         */

        const headers = [
            "Sl. No.",
            "Item No./Ledger No./Page No.",
            "Nomenclature",
            "A/U",
            "Serviceable/Unserviceable",
            "Cost of Procurement",
            "Date/Year of Procurement",
            "No. of years of useful service",
            "No. of years of non-utilization",
            "Reasons for disposal",
            "Recommended/Not Recommended",
            "Disposal Action",
            "Salvage/Scrap Weight",
        ];

        worksheet.addRow(headers);

        const headerRow = worksheet.getRow(3);

        headerRow.font = {
            bold: true,
        };

        headerRow.alignment = {
            horizontal: "center",
            vertical: "middle",
            wrapText: true,
        };

        /*
         * Data
         */

        disposals.forEach((item, index) => {

            const purchaseYear = item.purchase_date
                ? new Date(item.purchase_date).getFullYear()
                : null;

            const currentYear = new Date().getFullYear();

            const usefulYears = purchaseYear
                ? Math.max(currentYear - purchaseYear, 0)
                : "";

            worksheet.addRow([
                index + 1,

                item.ledger_number || "",

                item.asset_name || "",

                `${item.quantity || 0} ${item.unit || ""}`.trim(),

                "",

                item.purchase_cost != null
                    ? item.purchase_cost
                    : "",

                purchaseYear || "",

                usefulYears,

                "",

                item.reason || "",

                "",

                "",

                "",
            ]);

        });

        /*
         * Formatting
         */

        worksheet.columns = [
            { width: 10 },
            { width: 25 },
            { width: 40 },
            { width: 15 },
            { width: 25 },
            { width: 20 },
            { width: 20 },
            { width: 22 },
            { width: 25 },
            { width: 25 },
            { width: 25 },
            { width: 20 },
            { width: 20 },
        ];

        worksheet.eachRow((row, rowNumber) => {

            row.alignment = {
                vertical: "center",
                wrapText: true,
            };

            if (rowNumber >= 3) {

                row.eachCell((cell) => {

                    cell.border = {
                        top: {
                            style: "thin",
                        },
                        left: {
                            style: "thin",
                        },
                        bottom: {
                            style: "thin",
                        },
                        right: {
                            style: "thin",
                        },
                    };

                });

            }

        });

        worksheet.getRow(1).height = 25;
        worksheet.getRow(2).height = 25;
        worksheet.getRow(3).height = 45;

        /*
         * Send Excel file
         */

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            'attachment; filename="List_of_Items_for_Disposal.xlsx"'
        );

        await workbook.xlsx.write(res);

        res.end();

    } catch (error) {

        console.error(
            "Export Disposal List Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to generate disposal Excel file.",
        });

    }

};

exports.exportMyDisposalList = async (req, res) => {

    try {

        const userId = req.user.id;

        const [disposals] = await db.query(
            `
            SELECT
                ad.disposal_id,
                ad.quantity,
                ad.reason,
                ad.remarks,
                ad.disposed_at,

                i.sr_no,
                i.ledger_number,
                i.purchase_cost,
                i.purchase_date,
                i.unit,

                a.asset_name

            FROM asset_disposal ad

            INNER JOIN asset_assignment aa
                ON ad.assignment_id = aa.assignment_id

            INNER JOIN inventory i
                ON aa.inventory_id = i.inventory_id

            INNER JOIN assets a
                ON i.asset_id = a.asset_id

            WHERE
                ad.disposed_by = ?
                AND ad.is_deleted = 'no'

            ORDER BY ad.disposed_at ASC
            `,
            [userId]
        );

        const workbook = new ExcelJS.Workbook();

        const worksheet = workbook.addWorksheet(
            "My Disposals"
        );

        /*
         * Title
         */

        worksheet.mergeCells("A1:M1");

        const titleCell = worksheet.getCell("A1");

        titleCell.value =
            "CENTRE FOR FIRE, EXPLOSIVE ENVIRONMENT SAFETY, DELHI - 110054";

        titleCell.font = {
            bold: true,
            size: 14,
        };

        titleCell.alignment = {
            horizontal: "center",
            vertical: "middle",
        };

        worksheet.mergeCells("A2:M2");

        const subtitleCell = worksheet.getCell("A2");

        subtitleCell.value =
            "LIST OF ITEMS DISPOSED";

        subtitleCell.font = {
            bold: true,
            size: 13,
        };

        subtitleCell.alignment = {
            horizontal: "center",
            vertical: "middle",
        };

        /*
         * Headers
         */

        const headers = [
            "Sl. No.",
            "Item No./Ledger No./Page No.",
            "Nomenclature",
            "A/U",
            "Serviceable/Unserviceable",
            "Cost of Procurement",
            "Date/Year of Procurement",
            "No. of years of useful service",
            "No. of years of non-utilization",
            "Reasons for disposal",
            "Recommended/Not Recommended",
            "Disposal Action",
            "Salvage/Scrap Weight",
        ];

        worksheet.addRow(headers);

        const headerRow = worksheet.getRow(3);

        headerRow.font = {
            bold: true,
        };

        headerRow.alignment = {
            horizontal: "center",
            vertical: "middle",
            wrapText: true,
        };

        /*
         * Data
         */

        disposals.forEach((item, index) => {

            const purchaseYear = item.purchase_date
                ? new Date(item.purchase_date).getFullYear()
                : null;

            const currentYear =
                new Date().getFullYear();

            const usefulYears = purchaseYear
                ? Math.max(
                    currentYear - purchaseYear,
                    0
                )
                : "";

            worksheet.addRow([
                index + 1,

                item.ledger_number || "",

                item.asset_name || "",

                `${item.quantity || 0} ${item.unit || ""}`.trim(),

                "",

                item.purchase_cost != null
                    ? item.purchase_cost
                    : "",

                purchaseYear || "",

                usefulYears,

                "",

                item.reason || "",

                "",

                "",

                "",
            ]);

        });

        /*
         * Formatting
         */

        worksheet.columns = [
            { width: 10 },
            { width: 25 },
            { width: 40 },
            { width: 15 },
            { width: 25 },
            { width: 20 },
            { width: 20 },
            { width: 22 },
            { width: 25 },
            { width: 25 },
            { width: 25 },
            { width: 20 },
            { width: 20 },
        ];

        worksheet.eachRow((row, rowNumber) => {

            row.alignment = {
                vertical: "center",
                wrapText: true,
            };

            if (rowNumber >= 3) {

                row.eachCell((cell) => {

                    cell.border = {
                        top: {
                            style: "thin",
                        },
                        left: {
                            style: "thin",
                        },
                        bottom: {
                            style: "thin",
                        },
                        right: {
                            style: "thin",
                        },
                    };

                });

            }

        });

        worksheet.getRow(1).height = 25;
        worksheet.getRow(2).height = 25;
        worksheet.getRow(3).height = 45;

        /*
         * Send Excel file
         */

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            'attachment; filename="My_Disposals.xlsx"'
        );

        await workbook.xlsx.write(res);

        res.end();

    } catch (error) {

        console.error(
            "Export My Disposal List Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to generate disposal Excel file.",
        });

    }

};

exports.getGroupDisposals = async (req, res) => {

    try {

        const userId = req.user.id;

        const query = `
            SELECT
                ad.disposal_id,
                ad.assignment_id,
                ad.disposed_by,

                CONCAT_WS(
                    ' ',
                    u.first_name,
                    u.middle_name,
                    u.last_name
                ) AS disposed_by_name,

                ad.quantity,
                ad.reason,
                ad.remarks,
                ad.disposed_at,

                aa.inventory_id,

                i.ledger_number,
                i.sr_no,
                i.unit,

                a.asset_name

            FROM asset_disposal ad

            INNER JOIN asset_assignment aa
                ON ad.assignment_id = aa.assignment_id

            INNER JOIN inventory i
                ON aa.inventory_id = i.inventory_id

            INNER JOIN assets a
                ON i.asset_id = a.asset_id

            INNER JOIN users u
                ON ad.disposed_by = u.id

            WHERE
                ad.is_deleted = 'no'
                AND u.group_id = (
                    SELECT group_id
                    FROM users
                    WHERE id = ?
                )

            ORDER BY ad.disposed_at DESC
        `;

        const [disposals] = await db.query(query, [userId]);

        return res.status(200).json({
            success: true,
            count: disposals.length,
            disposals,
        });

    } catch (error) {

        console.error("Get Group Disposals Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }

};

exports.getDisposalById = async (req, res) => {

    try {

        const { id } = req.params;

        const disposalId = Number(id);

        const userId = req.user.id;
        const role = req.user.role;

        if (!Number.isInteger(disposalId) || disposalId <= 0) {

            return res.status(400).json({
                success: false,
                message: "Invalid disposal ID."
            });

        }

        let query = "";
        let params = [];

        if (role === "USER") {

            query = `
                SELECT
                    ad.disposal_id,
                    ad.assignment_id,
                    ad.disposed_by,
                    CONCAT_WS(
                        ' ',
                        u.first_name,
                        u.middle_name,
                        u.last_name
                    ) AS disposed_by_name,
                    ad.quantity,
                    ad.reason,
                    ad.remarks,
                    ad.disposed_at,
                    aa.inventory_id,
                    a.asset_name
                FROM asset_disposal ad
                INNER JOIN asset_assignment aa
                    ON ad.assignment_id = aa.assignment_id
                INNER JOIN inventory i
                    ON aa.inventory_id = i.inventory_id
                INNER JOIN assets a
                    ON i.asset_id = a.asset_id
                INNER JOIN users u
                    ON ad.disposed_by = u.id
                WHERE
                    ad.disposal_id = ?
                    AND ad.disposed_by = ?
                    AND ad.is_deleted = 'no'
            `;

            params = [
                disposalId,
                userId,
            ];

        }

        else if (role === "INVENTORY_HOLDER") {

            query = `
                SELECT
                    ad.disposal_id,
                    ad.assignment_id,
                    ad.disposed_by,
                    CONCAT_WS(
                        ' ',
                        u.first_name,
                        u.middle_name,
                        u.last_name
                    ) AS disposed_by_name,
                    ad.quantity,
                    ad.reason,
                    ad.remarks,
                    ad.disposed_at,
                    aa.inventory_id,
                    a.asset_name
                FROM asset_disposal ad
                INNER JOIN asset_assignment aa
                    ON ad.assignment_id = aa.assignment_id
                INNER JOIN inventory i
                    ON aa.inventory_id = i.inventory_id
                INNER JOIN assets a
                    ON i.asset_id = a.asset_id
                INNER JOIN users u
                    ON ad.disposed_by = u.id
                WHERE
                    ad.disposal_id = ?
                    AND ad.is_deleted = 'no'
            `;

            params = [disposalId];

        }

        else {

            return res.status(403).json({
                success: false,
                message: "Unauthorized access."
            });

        }

        const [disposal] = await db.query(query, params);

        if (disposal.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Disposal record not found."
            });

        }

        return res.status(200).json({
            success: true,
            disposal: disposal[0]
        });

    } catch (error) {

        console.error("Get Disposal By ID Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};