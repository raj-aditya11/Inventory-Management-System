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
    roleMiddleware("ADMIN"),
    createAsset
);

router.get(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    getAllAssets
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    getAssetById
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    updateAsset
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    deleteAsset
);

module.exports = router;