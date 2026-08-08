const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const {
    createUser,
    getAllUsers,
    getMyProfile,
    getUserById,
    updateUser,
    deleteUser,
} = require("../controllers/userController");

router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    createUser
);

router.get(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN","INVENTORY_HOLDER","USER"),
    getAllUsers
);

router.get(
    "/profile",
    authMiddleware,
    roleMiddleware("ADMIN", "INVENTORY_HOLDER", "USER"),
    getMyProfile
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    getUserById
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    updateUser
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    deleteUser
);

module.exports = router;