const express = require("express");
const router = express.Router();

const {
    createAssignment,
    getAllAssignments,
    getMyAssignments,
    getAssignmentById,
    updateAssignment,
    deleteAssignment
} = require("../controllers/assignmentController");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN","INVENTORY_HOLDER"),
    createAssignment
);

router.get(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN","INVENTORY_HOLDER"),
    getAllAssignments
);

router.get(
    "/my-assets",
    authMiddleware,
    getMyAssignments
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN","INVENTORY_HOLDER"),
    getAssignmentById
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN","INVENTORY_HOLDER"),
    updateAssignment
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN","INVENTORY_HOLDER"),
    deleteAssignment
);

module.exports = router;