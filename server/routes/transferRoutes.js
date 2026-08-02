const express = require("express");
const router = express.Router();

const {
    createTransferRequest,
    getAllTransferRequests,
    getTransferRequestById,
    approveTransferBySourceHolder,
    completeTransfer,
    rejectTransferRequest
} = require("../controllers/transferController");

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.post(
    "/",
    authMiddleware,
    roleMiddleware("USER"), 
    createTransferRequest
);

router.get(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    getAllTransferRequests
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    getTransferRequestById
);

router.put(
    "/source/:id",
    authMiddleware,
    roleMiddleware("INVENTORY_HOLDER"),
    approveTransferBySourceHolder
);

router.put(
    "/complete/:id",
    authMiddleware,
    roleMiddleware("INVENTORY_HOLDER"),
    completeTransfer
);

router.put(
    "/reject/:id",
    authMiddleware,
    roleMiddleware("INVENTORY_HOLDER"),
    rejectTransferRequest
);

module.exports = router;