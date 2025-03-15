// backend/routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const router = express.Router();

// Register User
router.post("/register", [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Valid email required").isEmail(),
  check("password", "Password must be at least 8 characters and include an uppercase letter, a number, and a special character")
    .isLength({ min: 8 })
    .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
  check("role", "Role must be either student or professor").isIn(["student", "professor"]),
  check("phone", "Valid phone number required").isMobilePhone(),
  check("university", "University is required").not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password, role, phone, university } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword, role, phone, university });
    await user.save();

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, university: user.university } });
  } catch (err) {
    console.error("Signup Error:", err.message, err.stack);
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
});

// Login User
router.post("/login", [
  check("email", "Valid email required").isEmail(),
  check("password", "Password is required").not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, university: user.university } });
  } catch (err) {
    console.error("Login Error:", err.message, err.stack);
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
});

module.exports = router;