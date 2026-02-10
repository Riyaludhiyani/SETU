const Product = require("../models/Product.js");
const Sale = require("../models/Sale.js");

// Add new product
exports.addProduct = async (req, res) => {
    try {
        const { title, description, category, originalPrice, sellingPrice, quantity, condition, images } = req.body;
        const agencyId = req.user.id;
        const agencyName = req.user.name;

        const product = await Product.create({
            title,
            description,
            category,
            originalPrice,
            sellingPrice,
            quantity,
            condition,
            images: images || [],
            agency: agencyId,
            agencyName,
            status: 'pending' // All products start as pending approval
        });

        res.status(201).json(product);
    } catch (error) {
        console.error("Add product error:", error);
        res.status(500).json({ message: "Failed to add product", error: error.message });
    }
};

// Get all products for logged-in agency
exports.getAgencyProducts = async (req, res) => {
    try {
        const agencyId = req.user.id;
        const { status } = req.query; // Filter by status if provided

        const filter = { agency: agencyId };
        if (status) {
            filter.status = status;
        }

        const products = await Product.find(filter).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        console.error("Get products error:", error);
        res.status(500).json({ message: "Failed to fetch products", error: error.message });
    }
};

// Get single product
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        console.error("Get product error:", error);
        res.status(500).json({ message: "Failed to fetch product", error: error.message });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if agency owns this product
        if (product.agency.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to update this product" });
        }

        // Can only update if status is pending or rejected
        if (product.status === 'approved' || product.status === 'sold') {
            return res.status(400).json({ message: "Cannot update approved or sold products" });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { ...req.body, status: 'pending' }, // Reset to pending after edit
            { new: true }
        );

        res.json(updatedProduct);
    } catch (error) {
        console.error("Update product error:", error);
        res.status(500).json({ message: "Failed to update product", error: error.message });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if agency owns this product
        if (product.agency.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this product" });
        }

        // Can't delete sold products
        if (product.status === 'sold') {
            return res.status(400).json({ message: "Cannot delete sold products" });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Delete product error:", error);
        res.status(500).json({ message: "Failed to delete product", error: error.message });
    }
};

// Get agency analytics
exports.getAnalytics = async (req, res) => {
    try {
        const agencyId = req.user.id;

        // Get all products
        const totalProducts = await Product.countDocuments({ agency: agencyId });
        const approvedProducts = await Product.countDocuments({ agency: agencyId, status: 'approved' });
        const pendingProducts = await Product.countDocuments({ agency: agencyId, status: 'pending' });
        const soldProducts = await Product.countDocuments({ agency: agencyId, status: 'sold' });

        // Get sales data
        const sales = await Sale.find({ agency: agencyId });
        const totalRevenue = sales.reduce((sum, sale) => sum + sale.amount, 0);
        const totalSales = sales.length;

        // Get views
        const products = await Product.find({ agency: agencyId });
        const totalViews = products.reduce((sum, product) => sum + product.views, 0);

        // Monthly sales data (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlySales = await Sale.aggregate([
            {
                $match: {
                    agency: agencyId,
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    revenue: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        // Category breakdown
        const categoryBreakdown = await Product.aggregate([
            {
                $match: { agency: agencyId, status: 'approved' }
            },
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            overview: {
                totalProducts,
                approvedProducts,
                pendingProducts,
                soldProducts,
                totalRevenue,
                totalSales,
                totalViews,
                conversionRate: totalViews > 0 ? ((totalSales / totalViews) * 100).toFixed(2) : 0
            },
            monthlySales,
            categoryBreakdown
        });
    } catch (error) {
        console.error("Get analytics error:", error);
        res.status(500).json({ message: "Failed to fetch analytics", error: error.message });
    }
};

// Get all approved products (for customers to browse)
exports.getAllProducts = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, search } = req.query;
        
        const filter = { status: 'approved' };
        
        if (category) filter.category = category;
        if (minPrice || maxPrice) {
            filter.sellingPrice = {};
            if (minPrice) filter.sellingPrice.$gte = Number(minPrice);
            if (maxPrice) filter.sellingPrice.$lte = Number(maxPrice);
        }
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const products = await Product.find(filter).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        console.error("Get all products error:", error);
        res.status(500).json({ message: "Failed to fetch products", error: error.message });
    }
};