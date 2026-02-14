const Product = require("../models/Product.js");
const User = require("../models/User.js");
const Order = require("../models/Order.js");

// Get all pending products for approval
exports.getPendingProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const products = await Product.find({ status: 'pending' })
            .populate('agency', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Product.countDocuments({ status: 'pending' });

        res.json({
            products,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / Number(limit)),
                totalProducts: total,
                hasMore: skip + products.length < total
            }
        });
    } catch (error) {
        console.error("Get pending products error:", error);
        res.status(500).json({ message: "Failed to fetch pending products", error: error.message });
    }
};

// Get all products with filters (for admin overview)
exports.getAllProducts = async (req, res) => {
    try {
        const { status, category, agency, search, page = 1, limit = 20 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const filter = {};
        if (status) filter.status = status;
        if (category) filter.category = category;
        if (agency) filter.agency = agency;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const products = await Product.find(filter)
            .populate('agency', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Product.countDocuments(filter);

        res.json({
            products,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / Number(limit)),
                totalProducts: total,
                hasMore: skip + products.length < total
            }
        });
    } catch (error) {
        console.error("Get all products error:", error);
        res.status(500).json({ message: "Failed to fetch products", error: error.message });
    }
};

// Approve a product
exports.approveProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.status !== 'pending') {
            return res.status(400).json({ message: `Product is already ${product.status}` });
        }

        product.status = 'approved';
        product.rejectionReason = undefined; // Clear any previous rejection reason
        await product.save();

        res.json({
            message: "Product approved successfully",
            product
        });
    } catch (error) {
        console.error("Approve product error:", error);
        res.status(500).json({ message: "Failed to approve product", error: error.message });
    }
};

// Reject a product
exports.rejectProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        if (!reason || reason.trim().length === 0) {
            return res.status(400).json({ message: "Rejection reason is required" });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.status === 'sold') {
            return res.status(400).json({ message: "Cannot reject sold products" });
        }

        product.status = 'rejected';
        product.rejectionReason = reason.trim();
        await product.save();

        res.json({
            message: "Product rejected successfully",
            product
        });
    } catch (error) {
        console.error("Reject product error:", error);
        res.status(500).json({ message: "Failed to reject product", error: error.message });
    }
};

// Get admin dashboard statistics
exports.getDashboardStats = async (req, res) => {
    try {
        // Product statistics
        const totalProducts = await Product.countDocuments();
        const pendingProducts = await Product.countDocuments({ status: 'pending' });
        const approvedProducts = await Product.countDocuments({ status: 'approved' });
        const rejectedProducts = await Product.countDocuments({ status: 'rejected' });
        const soldProducts = await Product.countDocuments({ status: 'sold' });

        // User statistics
        const totalAgencies = await User.countDocuments({ role: 'agency' });
        const totalCustomers = await User.countDocuments({ role: 'customer' });

        // Recent pending products (for quick view)
        const recentPending = await Product.find({ status: 'pending' })
            .populate('agency', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        // Products awaiting approval the longest
        const oldestPending = await Product.find({ status: 'pending' })
            .populate('agency', 'name')
            .sort({ createdAt: 1 })
            .limit(5);

        // Category breakdown
        const categoryBreakdown = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        // Status breakdown over time (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentActivity = await Product.aggregate([
            {
                $match: { createdAt: { $gte: sevenDaysAgo } }
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        status: "$status"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.date": 1 }
            }
        ]);

        res.json({
            overview: {
                totalProducts,
                pendingProducts,
                approvedProducts,
                rejectedProducts,
                soldProducts
            },
            users: {
                totalAgencies,
                totalCustomers,
                totalUsers: totalAgencies + totalCustomers
            },
            recentPending,
            oldestPending,
            categoryBreakdown,
            recentActivity
        });
    } catch (error) {
        console.error("Get admin stats error:", error);
        res.status(500).json({ message: "Failed to fetch dashboard stats", error: error.message });
    }
};

// Get single product details (admin view)
exports.getProductDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id)
            .populate('agency', 'name email');

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        console.error("Get product details error:", error);
        res.status(500).json({ message: "Failed to fetch product details", error: error.message });
    }
};

// Update product status (approve/reject with reason)
exports.updateProductStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, rejectionReason } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.status = status;
        if (status === 'rejected' && rejectionReason) {
            product.rejectionReason = rejectionReason;
        } else if (status === 'approved') {
            product.rejectionReason = undefined;
        }

        await product.save();

        res.json({ message: `Product ${status} successfully`, product });
    } catch (error) {
        console.error('Error updating product status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });
        
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user status (activate/suspend)
exports.updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['active', 'suspended'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: `User ${status} successfully`, user });
    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent deleting admin users
        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Cannot delete admin users' });
        }

        await User.findByIdAndDelete(id);

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get admin analytics
exports.getAdminAnalytics = async (req, res) => {
    try {
        // User statistics
        const totalUsers = await User.countDocuments();
        const agencies = await User.countDocuments({ role: 'agency' });
        const customers = await User.countDocuments({ role: 'customer' });

        // Product statistics
        const totalProducts = await Product.countDocuments();
        const pendingProducts = await Product.countDocuments({ status: 'pending' });
        const approvedProducts = await Product.countDocuments({ status: 'approved' });
        const rejectedProducts = await Product.countDocuments({ status: 'rejected' });
        const soldProducts = await Product.countDocuments({ status: 'sold' });

        // Order and revenue statistics
        const orders = await Order.find();
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(0) : 0;

        // Category breakdown
        const categories = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        // Top agencies by product count
        const topAgencies = await Product.aggregate([
            {
                $group: {
                    _id: "$agency",
                    productCount: { $sum: 1 }
                }
            },
            {
                $sort: { productCount: -1 }
            },
            {
                $limit: 10
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'agencyData'
                }
            },
            {
                $unwind: '$agencyData'
            },
            {
                $project: {
                    _id: 1,
                    productCount: 1,
                    name: '$agencyData.name',
                    email: '$agencyData.email'
                }
            }
        ]);

        // Monthly product submissions (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyProducts = await Product.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        // Recent activity (mock data for now - can be enhanced later)
        const recentProducts = await Product.find().sort({ createdAt: -1 }).limit(5).populate('agency', 'name');
        const recentActivity = recentProducts.map(product => ({
            icon: '📦',
            title: `New product: ${product.title}`,
            time: new Date(product.createdAt).toLocaleDateString(),
            badge: product.status,
            type: 'product'
        }));

        res.json({
            users: {
                total: totalUsers,
                agencies,
                customers
            },
            products: {
                total: totalProducts,
                pending: pendingProducts,
                approved: approvedProducts,
                rejected: rejectedProducts,
                sold: soldProducts
            },
            revenue: {
                total: totalRevenue,
                orders: totalOrders,
                avgOrder: avgOrderValue
            },
            categories,
            topAgencies,
            monthlyProducts,
            recentActivity
        });
    } catch (error) {
        console.error('Get admin analytics error:', error);
        res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
    }
};
