const express = require("express");
const router = express.Router();

const {
    getAllInternalDesignations,
} = require("../controllers/internalDesignationController");

const authMiddleware = require("../middlewares/authMiddleware");

router.get(
    "/",
    authMiddleware,
    getAllInternalDesignations
);

module.exports = router;