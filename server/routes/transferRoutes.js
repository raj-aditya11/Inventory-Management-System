const express = require("express");
const router = express.Router();

const {
    createTransferRequest
} = require("../controllers/transferController");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.post(
    "/",
    authMiddleware,
    roleMiddleware("USER"), 
    createTransferRequest
);

module.exports = router;