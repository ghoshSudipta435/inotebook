const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = process.env.JWT_SECRET; // Keep this safe!

// ROUTE 1: Create a new user - POST: "/api/auth/createUser" - Public
router.post('/createUser', [
  body('name', 'Name must be at least 3 characters').isLength({ min: 3 }).trim().escape(),
  body('email', 'Enter a valid email').isEmail().normalizeEmail(),
  body('password', 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 digit & 1 symbol')
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    }),
], async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }

  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success, error: "User already exists with this email" });
    }

    const salt = await bcrypt.genSalt(12);
    const secPass = await bcrypt.hash(password, salt);

    user = await User.create({ name, email, password: secPass });

    const payload = { user: { id: user.id } };
    const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });

    success = true;
    res.status(201).json({ success, authtoken });
  } catch (error) {
    console.error("Error in createUser:", error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});


// ROUTE 2: Authenticate user - POST: "/api/auth/login" - Public
router.post('/login', [
  body('email', 'Enter a valid email').isEmail().normalizeEmail(),
  body('password', 'Password cannot be blank').exists().notEmpty(),
], async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success, error: "Invalid credentials" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({ success, error: "Invalid credentials" });
    }

    const payload = { user: { id: user.id } };
    const authtoken = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });

    success = true;
    res.json({ success, authtoken });
  } catch (error) {
    console.error("Error in login:", error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});


// ROUTE 3: Get logged-in user info - POST: "/api/auth/getuser" - Protected
router.post('/getuser', fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.json({ success: true, user });
  } catch (error) {
    console.error("Error in getuser:", error.message);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

module.exports = router;
