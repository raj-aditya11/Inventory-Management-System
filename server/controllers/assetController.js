const db = require("../config/db");

exports.createAsset = async (req, res) => {
    try {
        const { asset_name, unit, description, status } = req.body;

        // Validate required fields
        if (!asset_name || !unit) {
            return res.status(400).json({
                message: "Asset name and unit are required."
            });
        }

        // Trim asset name, unit and description
        const trimmedAssetName = asset_name.trim();

        if (trimmedAssetName === "") {
            return res.status(400).json({
                message: "Asset name cannot be empty."
            });
        }

        const trimmedUnit = unit.trim();

        if (trimmedUnit === "") {
            return res.status(400).json({
                message: "Unit cannot be empty."
            });
        }

        const trimmedDescription = description?.trim() || null;

        // Validate status
        const numericStatus = Number(status);

        if (![0, 1].includes(numericStatus)) {
            return res.status(400).json({
                message: "Status must be either 0 or 1."
            });
        }

        // Check duplicate asset
        const [existingAsset] = await db.query(
            `SELECT asset_id FROM assets
             WHERE asset_name = ? AND is_deleted = 'no'`,
            [trimmedAssetName]
        );

        if (existingAsset.length > 0) {
            return res.status(409).json({
                message: "Asset already exists."
            });
        }

        // Insert asset
        const [result] = await db.query(
            `INSERT INTO assets
            (asset_name, unit, description, status)
            VALUES (?, ?, ?, ?)`,
            [
                trimmedAssetName,
                trimmedUnit,
                trimmedDescription,
                numericStatus
            ]
        );

        return res.status(201).json({
            message: "Asset created successfully.",
            assetId: result.insertId
        });

    } catch (error) {
        console.error("Create Asset Error:", error);

        return res.status(500).json({
            message: "Internal Server Error."
        });
    }
};

exports.getAllAssets = async (req, res) => {
    try {
        const [assets] = await db.query(`
            SELECT
                asset_id,
                asset_name,
                unit,
                description,
                status
            FROM assets
            WHERE is_deleted = 'no'
            ORDER BY created_at DESC
        `);

        return res.status(200).json({
            success: true,
            count: assets.length,
            data: assets,
        });

    } catch (error) {
        console.error("Get Assets Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

exports.getAssetById = async (req, res) => {
    try {
        const { id } = req.params;

        const assetId = Number(id);

        // Validate ID
        if (!Number.isInteger(assetId) || assetId <= 0){
            return res.status(400).json({
                success: false,
                message: "Invalid asset ID.",
            });
        }

        const [assets] = await db.query(
            `
            SELECT
                asset_id,
                asset_name,
                unit,
                description,
                status
            FROM assets
            WHERE asset_id = ? AND is_deleted = ?
            `,
            [assetId, "no"]
        );

        if (assets.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Asset not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: assets[0],
        });

    } catch (error) {
        console.error("Get Asset By ID Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

exports.updateAsset = async (req, res) => {
    try {
        const { id } = req.params;

        const assetId = Number(id);

        // Validate ID
        if (!Number.isInteger(assetId) || assetId <= 0){
            return res.status(400).json({
                success: false,
                message: "Invalid asset ID.",
            });
        }

        const {
            asset_name,
            unit,
            description,
            status,
        } = req.body;

        const trimmedAssetName = asset_name?.trim();

        const trimmedUnit = unit?.trim();

        const trimmedDescription = description?.trim() || null;

        // Required field validation
        if (!trimmedAssetName) {
            return res.status(400).json({
                success: false,
                message: "Asset name is required.",
            });
        }

        if (!trimmedUnit) {
            return res.status(400).json({
                success: false,
                message: "Unit is required.",
            });
        }

        const numericStatus = Number(status);

        if (![0, 1].includes(numericStatus)) {
            return res.status(400).json({
                success: false,
                message: "Status must be either 0 or 1.",
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

        // Check duplicate asset name
        const [assetExists] = await db.query(
            `
            SELECT asset_id
            FROM assets
            WHERE asset_name = ?
            AND asset_id <> ?
            AND is_deleted = ?
            `,
            [trimmedAssetName, assetId, "no"]
        );

        if (assetExists.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Asset name already exists.",
            });
        }

        // Update asset
        const [result] = await db.query(
            `
            UPDATE assets
            SET
                asset_name = ?,
                unit = ?,
                description = ?,
                status = ?
            WHERE asset_id = ?
            AND is_deleted = ?
            `,
            [
                trimmedAssetName,
                trimmedUnit,
                trimmedDescription,
                numericStatus,
                assetId,
                "no",
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Asset not found or already deleted.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Asset updated successfully.",
        });

    } catch (error) {
        console.error("Update Asset Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

exports.deleteAsset = async (req, res) => {
    try {
        const { id } = req.params;

        const assetId = Number(id);

        // Validate ID
        if (!Number.isInteger(assetId) || assetId <= 0 ) {
            return res.status(400).json({
                success: false,
                message: "Invalid asset ID.",
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

        // Soft delete
        const [result] = await db.query(
            `
            UPDATE assets
            SET is_deleted = ?
            WHERE asset_id = ?
            AND is_deleted = ?
            `,
            ["yes", assetId, "no"]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Asset not found or already deleted.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Asset deleted successfully.",
        });

    } catch (error) {
        console.error("Delete Asset Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};