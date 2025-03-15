// backend/server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5001;

// ✅ Middleware should be before routes
app.use(express.json()); // Parses JSON request body
app.use(cors()); // Enables CORS

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error(err));

// ✅ Define routes after middleware
app.use("/api/auth", require("./routes/auth"));

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the MERN Stack API!");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});