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
    roleMiddleware("ADMIN"),
    createInventory
);

router.get(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    getAllInventory
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    getInventoryById
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    updateInventory
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    deleteInventory
)

module.exports = router;