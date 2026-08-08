const express = require("express");
const router = express.Router();

const{
    createInventory,
    getAllInventory,
    getInventoryById,
    updateInventory,
    deleteInventory
} = require("../controllers/inventoryController");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN","INVENTORY_HOLDER"),
    createInventory
);

router.get(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN","INVENTORY_HOLDER"),
    getAllInventory
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN","INVENTORY_HOLDER"),
    getInventoryById
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN","INVENTORY_HOLDER"),
    updateInventory
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN","INVENTORY_HOLDER"),
    deleteInventory
)

module.exports = router;