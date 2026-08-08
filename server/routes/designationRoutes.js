const express = require("express");
const router = express.Router();

const {
    getAllDesignations,
} = require("../controllers/designationController");

const authMiddleware = require("../middlewares/authMiddleware");

router.get(
    "/",
    authMiddleware,
    getAllDesignations
);

module.exports = router;