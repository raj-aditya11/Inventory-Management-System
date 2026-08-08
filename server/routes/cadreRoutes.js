const express = require("express");
const router = express.Router();

const { getAllCadres } = require("../controllers/cadreController");

const authMiddleware = require("../middlewares/authMiddleware");

router.get(
    "/",
    authMiddleware,
    getAllCadres
);

module.exports = router;