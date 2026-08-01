const express = require("express");
const router = express.Router();

const {
    createAssignment,
    getAllAssignments,
    getAssignmentById,
    updateAssignment,
    deleteAssignment
} = require("../controllers/assignmentController");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    createAssignment
);

router.get(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    getAllAssignments
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    getAssignmentById
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    updateAssignment
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    deleteAssignment
)

module.exports = router;