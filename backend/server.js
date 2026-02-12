const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/customer", require("./routes/customerRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || "mongodb+srv://ludhiyaniharsha_db_user:XqMHAji2fe020yMA@cluster0.jlditfa.mongodb.net/?appName=Cluster0")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("DB Error:", err));

// Test Route
app.get("/", (req, res) => {
    res.send("Setu Backend Running Successfully!");
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));