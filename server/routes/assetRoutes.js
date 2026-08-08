const express = require("express");
const router = express.Router();

const {
    createAsset,
    getAllAssets,
    getAssetById,
    updateAsset,
    deleteAsset,
} = require("../controllers/assetController");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN","INVENTORY_HOLDER"),
    createAsset
);

router.get(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN","INVENTORY_HOLDER"),
    getAllAssets
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN","INVENTORY_HOLDER"),
    getAssetById
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN","INVENTORY_HOLDER"),
    updateAsset
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN","INVENTORY_HOLDER"),
    deleteAsset
);

module.exports = router;