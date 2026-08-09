const express = require("express");
const router = express.Router();

const {
    getNotifications,
    markNotificationAsRead,
    getUnreadNotificationCount,
    markAllNotificationsAsRead
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

router.get(
    "/unread",
    authMiddleware,
    getUnreadNotificationCount
);

router.put(
    "/read",
    authMiddleware,
    markAllNotificationsAsRead
);

module.exports = router;