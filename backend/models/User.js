const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: {
        type: String,
        enum: ["agency", "customer", "admin"],
        default: "customer"
    },
    status: {
        type: String,
        enum: ["active", "suspended"],
        default: "active"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);