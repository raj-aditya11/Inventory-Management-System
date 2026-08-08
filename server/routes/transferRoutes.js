const express = require("express");
const router = express.Router();

const {
    createTransferRequest,
    getAllTransferRequests,
    getMyTransferRequests,
    getPendingTransferRequests,
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
    roleMiddleware("ADMIN","INVENTORY_HOLDER"),
    getAllTransferRequests
);

router.get(
    "/my",
    authMiddleware,
    getMyTransferRequests
);

router.get(
    "/pending",
    authMiddleware,
    roleMiddleware("INVENTORY_HOLDER"),
    getPendingTransferRequests
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