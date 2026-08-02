const express = require("express");
const router = express.Router();

const {
    disposeAsset,
    getDisposals,
    getDisposalById
} = require("../controllers/disposalController");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.post(
    "/",
    authMiddleware,
    roleMiddleware("USER", "INVENTORY_HOLDER"),
    disposeAsset
);

router.get(
    "/",
    authMiddleware,
    roleMiddleware("USER", "INVENTORY_HOLDER"),
    getDisposals
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("USER", "INVENTORY_HOLDER"),
    getDisposalById
);

module.exports = router;