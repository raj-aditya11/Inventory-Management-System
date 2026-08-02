const express = require("express");
const router = express.Router();

const {
    getNotifications,
    markNotificationAsRead
} = require("../controllers/notificationController");

const authMiddleware = require("../middlewares/authMiddleware");

router.get(
    "/",
    authMiddleware,
    getNotifications
);

router.put(
    "/:id/read",
    authMiddleware,
    markNotificationAsRead
);

module.exports = router;