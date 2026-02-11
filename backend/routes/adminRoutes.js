const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController.js");
const authMiddleware = require("../middleware/authMiddleware.js");

// All routes require admin authentication
router.use(authMiddleware(["admin"]));

// Dashboard statistics
router.get("/dashboard-stats", adminController.getDashboardStats);

// Product management routes
router.get("/pending-products", adminController.getPendingProducts);
router.get("/products", adminController.getAllProducts);
router.get("/products/:id", adminController.getProductDetails);
router.post("/products/:id/approve", adminController.approveProduct);
router.post("/products/:id/reject", adminController.rejectProduct);

module.exports = router;
