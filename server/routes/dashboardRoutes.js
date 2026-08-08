const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const {
    getAdminDashboard,
    getInventoryHolderDashboard,
    getUserDashboard,
} = require("../controllers/dashboardController");

router.get(
    "/admin",
    authMiddleware,
    roleMiddleware("ADMIN"),
    getAdminDashboard
);

router.get(
    "/inventory-holder",
    authMiddleware,
    roleMiddleware("INVENTORY_HOLDER"),
    getInventoryHolderDashboard
);

router.get(
    "/user",
    authMiddleware,
    roleMiddleware("USER"),
    getUserDashboard
);

module.exports = router;