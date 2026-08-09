const db = require("../config/db");

const createNotification = async (
    connection,
    receiverId,
    title,
    message
) => {

    await connection.query(
        `
        INSERT INTO notifications
        (
            receiver_id,
            title,
            message
        )
        VALUES (?, ?, ?)
        `,
        [
            receiverId,
            title,
            message,
        ]
    );

};

exports.getNotifications = async (req, res) => {

    try {

        const receiverId = req.user.id;

        const [notifications] = await db.query(
            `
            SELECT
                notification_id,
                title,
                message,
                is_read,
                created_at
            FROM notifications
            WHERE receiver_id = ?
            ORDER BY created_at DESC
            `,
            [receiverId]
        );

        return res.status(200).json({
            success: true,
            count: notifications.length,
            notifications,
        });

    } catch (error) {

        console.error("Get Notifications Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }

};

exports.markNotificationAsRead = async (req, res) => {

    try {

        const { id } = req.params;

        const notificationId = Number(id);

        const receiverId = req.user.id;

        if (!Number.isInteger(notificationId) || notificationId <= 0) {

            return res.status(400).json({
                success: false,
                message: "Invalid notification ID.",
            });

        }

        const [notification] = await db.query(
            `
            SELECT
                notification_id,
                receiver_id,
                is_read
            FROM notifications
            WHERE notification_id = ?
            `,
            [notificationId]
        );

        if (notification.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Notification not found.",
            });

        }

        if (notification[0].receiver_id !== receiverId) {

            return res.status(403).json({
                success: false,
                message: "Unauthorized access.",
            });

        }

        if (notification[0].is_read === 1) {

            return res.status(200).json({
                success: true,
                message: "Notification already marked as read.",
            });

        }

        await db.query(
            `
            UPDATE notifications
            SET is_read = 1
            WHERE notification_id = ?
            `,
            [notificationId]
        );

        return res.status(200).json({
            success: true,
            message: "Notification marked as read.",
        });

    } catch (error) {

        console.error("Mark Notification Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }

};

exports.getUnreadNotificationCount = async (req, res) => {

    try {

        const receiverId = req.user.id;

        const [result] = await db.query(
            `
            SELECT COUNT(*) AS unreadCount
            FROM notifications
            WHERE
                receiver_id = ?
                AND is_read = 0
            `,
            [receiverId]
        );

        return res.status(200).json({
            success: true,
            unreadCount: result[0].unreadCount,
        });

    } catch (error) {

        console.error(
            "Get Unread Notification Count Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }

};

exports.markAllNotificationsAsRead = async (req, res) => {

    try {

        const receiverId = req.user.id;

        await db.query(
            `
            UPDATE notifications
            SET is_read = 1
            WHERE
                receiver_id = ?
                AND is_read = 0
            `,
            [receiverId]
        );

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read.",
        });

    } catch (error) {

        console.error(
            "Mark All Notifications Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }

};

module.exports.createNotification = createNotification;