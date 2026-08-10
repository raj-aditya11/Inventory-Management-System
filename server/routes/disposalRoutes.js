const express = require("express");
const router = express.Router();

const {
    disposeAsset,
    getDisposals,
    getGroupDisposals,
    exportDisposalList,
    exportMyDisposalList,
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
    "/group",
    authMiddleware,
    roleMiddleware("INVENTORY_HOLDER"),
    getGroupDisposals
);

router.get(
    "/export",
    authMiddleware,
    exportDisposalList
);

router.get(
    "/export/my",
    authMiddleware,
    exportMyDisposalList
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("USER", "INVENTORY_HOLDER"),
    getDisposalById
);

module.exports = router;