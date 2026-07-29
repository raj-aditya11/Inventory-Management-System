const express = require("express");
const router = express.Router();

const {
    createGroup,
    getAllGroups,
    getGroupById,
    updateGroup,
    deleteGroup,
} = require("../controllers/groupController");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    createGroup
);

router.get(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    getAllGroups
)

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    getGroupById
)

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    updateGroup
)

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    deleteGroup
)

module.exports = router;