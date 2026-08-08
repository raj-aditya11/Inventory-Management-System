const db = require("../config/db");

exports.createInventory = async (req, res) => {
    try {
        const {
            asset_id,
            sr_no,
            ledger_number,
            quantity_received,
            purchase_cost,
            purchase_date,
            received_by,
            remarks,
            status,
        } = req.body;

        // Validate required fields
        if (
            !asset_id ||
            !sr_no ||
            !ledger_number ||
            !quantity_received ||
            purchase_cost === undefined ||
            !purchase_date ||
            !received_by
        ) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided.",
            });
        }

        // Convert numeric values
        const assetId = Number(asset_id);
        const serialNo = Number(sr_no);
        const quantityReceived = Number(quantity_received);
        const purchaseCost = Number(purchase_cost);
        const receivedBy = Number(received_by);
        const numericStatus = Number(status);

        // Trim strings
        const trimmedLedgerNumber = ledger_number.trim();
        const trimmedRemarks = remarks?.trim() || null;

        // Validate IDs
        if (!Number.isInteger(assetId) || assetId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid asset ID.",
            });
        }

        if (!Number.isInteger(serialNo) || serialNo <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid serial number.",
            });
        }

        if (!Number.isInteger(receivedBy) || receivedBy <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid receiver ID.",
            });
        }

        if (quantityReceived <= 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity received must be greater than 0.",
            });
        }

        if (purchaseCost < 0) {
            return res.status(400).json({
                success: false,
                message: "Purchase cost cannot be negative.",
            });
        }

        if (!trimmedLedgerNumber) {
            return res.status(400).json({
                success: false,
                message: "Ledger number is required.",
            });
        }

        if (![0, 1].includes(numericStatus)) {
            return res.status(400).json({
                success: false,
                message: "Status must be either 0 or 1.",
            });
        }

        // Check asset exists
        const [asset] = await db.query(
            `
            SELECT asset_id
            FROM assets
            WHERE asset_id = ?
            AND is_deleted = ?
            `,
            [assetId, "no"]
        );

        if (asset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Asset not found.",
            });
        }

        // Check receiver exists
        const [user] = await db.query(
            `
            SELECT id
            FROM users
            WHERE id = ?
            AND role = ?
            AND is_deleted = ?
            `,
            [receivedBy, "INVENTORY_HOLDER", "no"]
        );

        if (user.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Receiver not found.",
            });
        }

        // Check duplicate serial number
        const [existingInventory] = await db.query(
            `
            SELECT inventory_id
            FROM inventory
            WHERE sr_no = ?
            AND is_deleted = ?
            `,
            [serialNo, "no"]
        );

        if (existingInventory.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Serial number already exists.",
            });
        }

        // Insert inventory
        const [result] = await db.query(
            `
            INSERT INTO inventory
            (
                asset_id,
                sr_no,
                ledger_number,
                quantity_received,
                quantity_available,
                quantity_disposed,
                purchase_cost,
                purchase_date,
                received_by,
                remarks,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                assetId,
                serialNo,
                trimmedLedgerNumber,
                quantityReceived,
                quantityReceived,
                0,
                purchaseCost,
                purchase_date,
                receivedBy,
                trimmedRemarks,
                numericStatus,
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Inventory created successfully.",
            inventoryId: result.insertId,
        });

    } catch (error) {
        console.error("Create Inventory Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

exports.getAllInventory = async (req, res) => {
    const userId = req.user.id;
    const role = req.user.role;

    try {
        let query = "";
        let params = [];

        if (role === "ADMIN") {

            query = `
                SELECT
                    i.inventory_id,
                    i.asset_id,
                    a.asset_name,
                    i.sr_no,
                    i.ledger_number,
                    i.quantity_received,
                    i.quantity_available,
                    i.quantity_disposed,
                    i.purchase_cost,
                    i.purchase_date,
                    i.received_by,
                    i.remarks,
                    i.status,
                    i.created_at
                FROM inventory i
                INNER JOIN assets a
                    ON i.asset_id = a.asset_id
                WHERE i.is_deleted = 'no'
                ORDER BY i.created_at DESC
            `;

        } else if (role === "INVENTORY_HOLDER") {

            query = `
                SELECT
                    i.inventory_id,
                    i.asset_id,
                    a.asset_name,
                    i.sr_no,
                    i.ledger_number,
                    i.quantity_received,
                    i.quantity_available,
                    i.quantity_disposed,
                    i.purchase_cost,
                    i.purchase_date,
                    i.received_by,
                    i.remarks,
                    i.status,
                    i.created_at
                FROM inventory i
                INNER JOIN assets a
                    ON i.asset_id = a.asset_id
                WHERE
                    i.received_by = ?
                    AND i.is_deleted = 'no'
                ORDER BY i.created_at DESC
            `;

            params = [userId];

        } else {

            return res.status(403).json({
                success: false,
                message: "Unauthorized access."
            });

        }

        const [inventory] = await db.query(query, params);
        return res.status(200).json({
            success: true,
            count: inventory.length,
            data: inventory,
        });

    } catch (error) {
        console.error("Get Inventory Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

exports.getInventoryById = async (req, res) => {
    try {
        const inventoryId = Number(req.params.id);

        if (!Number.isInteger(inventoryId) || inventoryId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid inventory ID.",
            });
        }

        const [inventory] = await db.query(
            `
            SELECT
                inventory_id,
                asset_id,
                sr_no,
                ledger_number,
                quantity_received,
                quantity_available,
                quantity_disposed,
                purchase_cost,
                purchase_date,
                received_by,
                remarks,
                status
            FROM inventory
            WHERE inventory_id = ?
            AND is_deleted = ?
            `,
            [inventoryId, "no"]
        );

        if (inventory.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Inventory not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: inventory[0],
        });

    } catch (error) {
        console.error("Get Inventory By ID Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

exports.updateInventory = async (req, res) => {
    try {
        const inventoryId = Number(req.params.id);

        if (!Number.isInteger(inventoryId) || inventoryId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid inventory ID.",
            });
        }

        const {
            asset_id,
            sr_no,
            ledger_number,
            quantity_received,
            purchase_cost,
            purchase_date,
            received_by,
            remarks,
            status,
        } = req.body;

        const assetId = Number(asset_id);
        const serialNo = Number(sr_no);
        const quantityReceived = Number(quantity_received);
        const purchaseCost = Number(purchase_cost);
        const receivedBy = Number(received_by);
        const numericStatus = Number(status);

        const trimmedLedger = ledger_number?.trim();
        const trimmedRemarks = remarks?.trim() || null;

        if (
            !Number.isInteger(assetId) ||
            !Number.isInteger(serialNo) ||
            !Number.isInteger(receivedBy) ||
            assetId <= 0 ||
            serialNo <= 0 ||
            receivedBy <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid input.",
            });
        }

        if (!trimmedLedger) {
            return res.status(400).json({
                success: false,
                message: "Ledger number is required.",
            });
        }

        if (quantityReceived <= 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity received must be greater than zero.",
            });
        }

        if (purchaseCost < 0) {
            return res.status(400).json({
                success: false,
                message: "Purchase cost cannot be negative.",
            });
        }

        if (![0,1].includes(numericStatus)) {
            return res.status(400).json({
                success: false,
                message: "Status must be either 0 or 1.",
            });
        }

        const [existing] = await db.query(
            `
            SELECT quantity_available, quantity_disposed
            FROM inventory
            WHERE inventory_id = ?
            AND is_deleted = ?
            `,
            [inventoryId, "no"]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success:false,
                message:"Inventory not found.",
            });
        }

        const available = existing[0].quantity_available;
        const disposed = existing[0].quantity_disposed;

        if (quantityReceived < available + disposed) {
            return res.status(400).json({
                success:false,
                message:"Quantity received cannot be less than already assigned/disposed quantity.",
            });
        }

        // Check if asset exists
        const [existingAsset] = await db.query(
            `
            SELECT asset_id
            FROM assets
            WHERE asset_id = ?
            AND is_deleted = ?
            `,
            [assetId, "no"]
        );

        if (existingAsset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Asset not found.",
            });
        }

        // Check if receiver exists
        const [existingUser] = await db.query(
            `
            SELECT id
            FROM users
            WHERE id = ?
            AND role = ?
            AND is_deleted = ?
            `,
            [receivedBy,"INVENTORY_HOLDER", "no"]
        );

        if (existingUser.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Receiver not found.",
            });
        }

        // Check duplicate serial number
        const [serialExists] = await db.query(
            `
            SELECT inventory_id
            FROM inventory
            WHERE sr_no = ?
            AND inventory_id <> ?
            AND is_deleted = ?
            `,
            [serialNo, inventoryId, "no"]
        );

        if (serialExists.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Serial number already exists.",
            });
        }

        const newAvailable = quantityReceived - disposed;

        const [result] = await db.query(
            `
            UPDATE inventory
            SET
                asset_id = ?,
                sr_no = ?,
                ledger_number = ?,
                quantity_received = ?,
                quantity_available = ?,
                purchase_cost = ?,
                purchase_date = ?,
                received_by = ?,
                remarks = ?,
                status = ?
            WHERE inventory_id = ?
            AND is_deleted = ?
            `,
            [
                assetId,
                serialNo,
                trimmedLedger,
                quantityReceived,
                newAvailable,
                purchaseCost,
                purchase_date,
                receivedBy,
                trimmedRemarks,
                numericStatus,
                inventoryId,
                "no"
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Inventory not found or already deleted."
            });
        }

        return res.status(200).json({
            success:true,
            message:"Inventory updated successfully."
        });

    } catch(error){
        console.error("Update Inventory Error:", error);

        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });
    }
};

exports.deleteInventory = async (req, res) => {
    try {
        const inventoryId = Number(req.params.id);

        if (!Number.isInteger(inventoryId) || inventoryId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid inventory ID.",
            });
        }

        const [existing] = await db.query(
            `
            SELECT inventory_id
            FROM inventory
            WHERE inventory_id = ?
            AND is_deleted = ?
            `,
            [inventoryId, "no"]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Inventory not found.",
            });
        }

        const [result] = await db.query(
            `
            UPDATE inventory
            SET is_deleted = ?
            WHERE inventory_id = ?
            AND is_deleted = ?
            `,
            ["yes", inventoryId, "no"]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Inventory not found or already deleted.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Inventory deleted successfully.",
        });

    } catch (error) {
        console.error("Delete Inventory Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};