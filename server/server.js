const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const groupRoutes = require("./routes/groupRoutes");
const assetRoutes = require("./routes/assetRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const transferRoutes = require("./routes/transferRoutes");
const disposalRoutes = require("./routes/disposalRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

require("dotenv").config();

const db = require("./config/db");

const app = express();

const authMiddleware = require("./middlewares/authMiddleware");

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/transfers", transferRoutes);
app.use("/api/disposals", disposalRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/profile", authMiddleware, (req, res) => {
    const { id, username, role } = req.user;

    res.json({
        success: true,
        user: {
            id,
            username,
            role,
        },
    });
});

app.get("/health", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT 1 AS connected");

        res.status(200).json({
            success: true,
            message: "Backend and Database connected!",
            database: rows[0],
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Database connection failed",
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});