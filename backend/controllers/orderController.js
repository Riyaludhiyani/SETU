const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// Place new order (Customer)
exports.placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    const customerId = req.user._id;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }
    // Calculate totals and fetch product details
    let totalAmount = 0;
    let totalSavings = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient quantity for ${product.title}` });
      }

      const itemTotal = product.sellingPrice * item.quantity;
      const savings = (product.originalPrice - product.sellingPrice) * item.quantity;
      
      totalAmount += itemTotal;
      totalSavings += savings;

      orderItems.push({
        product: product._id,
        productTitle: product.title,
        productImage: product.images[0] || '',
        agency: product.agency,
        agencyName: product.agencyName,
        quantity: item.quantity,
        price: product.sellingPrice,
        originalPrice: product.originalPrice
      });

      // Update product quantity
      product.quantity -= item.quantity;
      if (product.quantity === 0) {
        product.status = 'sold';
      }
      await product.save();
    }

    // Create order
    const order = await Order.create({
      customer: customerId,
      customerName: req.user.name,
      customerEmail: req.user.email,
      items: orderItems,
      shippingAddress,
      totalAmount,
      totalSavings,
      paymentMethod: paymentMethod || 'cod',
      orderStatus: 'pending',
      trackingUpdates: [{
        status: 'Order Placed',
        message: 'Your order has been placed successfully',
        timestamp: new Date()
      }]
    });

    res.status(201).json({ 
      message: 'Order placed successfully', 
      order 
    });
  } catch (error) {
    console.error('Place order error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({ 
      message: error.message || 'Failed to place order'
    });
  }
};

// Get customer's orders
exports.getMyOrders = async (req, res) => {
  try {
    const customerId = req.user._id;
    const orders = await Order.find({ customer: customerId })
      .sort({ createdAt: -1 })
      .populate('items.product');

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// Get single order details
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is authorized to view this order
    if (order.customer.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      // Check if user is the agency for any item in the order
      const isAgency = order.items.some(item => 
        item.agency && item.agency.toString() === req.user._id.toString()
      );
      
      if (!isAgency) {
        return res.status(403).json({ message: 'Not authorized to view this order' });
      }
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
};

// Get agency's orders
exports.getAgencyOrders = async (req, res) => {
  try {
    const agencyId = req.user._id;
    
    // Find all orders that contain items from this agency
    const orders = await Order.find({
      'items.agency': agencyId
    })
    .sort({ createdAt: -1 })
    .populate('items.product');

    res.json(orders);
  } catch (error) {
    console.error('Get agency orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// Get recent orders for analytics
exports.getRecentOrders = async (req, res) => {
  try {
    const agencyId = req.user._id;
    
    const orders = await Order.find({
      'items.agency': agencyId
    })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('customer', 'name email')
    .select('orderNumber totalAmount status createdAt customer');

    res.json(orders);
  } catch (error) {
    console.error('Get recent orders error:', error);
    res.status(500).json({ message: 'Failed to fetch recent orders' });
  }
};

// Update order status (Agency)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const agencyId = req.user._id;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if agency owns any item in this order
    const hasAgencyItem = order.items.some(item => 
      item.agency && item.agency.toString() === agencyId.toString()
    );

    if (!hasAgencyItem) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    const validStatuses = ['confirmed', 'processing', 'shipped', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    order.orderStatus = status;

    if (status === 'delivered') {
      order.deliveredAt = new Date();
      order.paymentStatus = 'completed';
    }

    await order.save();

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
};

// Add tracking update (Agency)
exports.addTrackingUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, message } = req.body;
    const agencyId = req.user._id;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if agency owns any item in this order
    const hasAgencyItem = order.items.some(item => 
      item.agency && item.agency.toString() === agencyId.toString()
    );

    if (!hasAgencyItem) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    order.trackingUpdates.push({
      status,
      message,
      timestamp: new Date()
    });

    await order.save();

    res.json({ message: 'Tracking update added', order });
  } catch (error) {
    console.error('Add tracking update error:', error);
    res.status(500).json({ message: 'Failed to add tracking update' });
  }
};

// Cancel order (Customer)
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const customerId = req.user._id;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.customer.toString() !== customerId.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    if (['delivered', 'cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({ message: 'Cannot cancel this order' });
    }

    order.orderStatus = 'cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = reason;
    order.trackingUpdates.push({
      status: 'Cancelled',
      message: reason || 'Order cancelled by customer',
      timestamp: new Date()
    });

    // Restore product quantities
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.quantity += item.quantity;
        if (product.status === 'sold') {
          product.status = 'approved';
        }
        await product.save();
      }
    }

    await order.save();

    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Failed to cancel order' });
  }
};

// Get order statistics (Agency)
exports.getAgencyOrderStats = async (req, res) => {
  try {
    const agencyId = req.user._id;

    const orders = await Order.find({
      'items.agency': agencyId
    });

    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.orderStatus === 'pending').length,
      confirmed: orders.filter(o => o.orderStatus === 'confirmed').length,
      processing: orders.filter(o => o.orderStatus === 'processing').length,
      shipped: orders.filter(o => o.orderStatus === 'shipped').length,
      delivered: orders.filter(o => o.orderStatus === 'delivered').length,
      cancelled: orders.filter(o => o.orderStatus === 'cancelled').length,
      totalRevenue: orders
        .filter(o => o.orderStatus === 'delivered')
        .reduce((sum, order) => {
          const agencyItems = order.items.filter(item => 
            item.agency && item.agency.toString() === agencyId.toString()
          );
          return sum + agencyItems.reduce((itemSum, item) => 
            itemSum + (item.price * item.quantity), 0
          );
        }, 0)
    };

    res.json(stats);
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({ message: 'Failed to fetch order statistics' });
  }
};
