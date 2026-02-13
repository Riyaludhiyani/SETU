const router = require("express").Router();
const {
    addProduct,
    getAgencyProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getAnalytics,
    getTopProducts,
    getAllProducts
} = require("../controllers/productController.js");
const authMiddleware = require("../middleware/authMiddleware.js");

// Public routes
router.get("/all", getAllProducts); // For customers to browse

// Protected routes - Agency only
router.post("/", authMiddleware(['agency']), addProduct);
router.get("/my-products", authMiddleware(['agency']), getAgencyProducts);
router.get("/analytics", authMiddleware(['agency']), getAnalytics);
router.get("/top-products", authMiddleware(['agency']), getTopProducts);
router.get("/:id", authMiddleware(), getProduct);
router.put("/:id", authMiddleware(['agency']), updateProduct);
router.delete("/:id", authMiddleware(['agency']), deleteProduct);

module.exports = router;