const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Electronics', 'Furniture', 'Clothing', 'Appliances', 'Toys', 'Vehicles', 'Others']
    },
    originalPrice: {
        type: Number,
        required: true
    },
    sellingPrice: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    condition: {
        type: String,
        enum: ['New', 'Like New', 'Good', 'Fair'],
        default: 'Good'
    },
    images: [{
        type: String
    }],
    agency: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    agencyName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'sold'],
        default: 'pending'
    },
    views: {
        type: Number,
        default: 0
    },
    rejectionReason: {
        type: String
    },
    soldDate: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Product", productSchema);