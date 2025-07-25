const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = process.env.JWT_SECRET; // 🔐 Load from .env

// ROUTE 1: Create a user using POST: "/api/auth/createUser" (No login required)
router.post('/createUser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
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

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(password, salt);

    user = await User.create({ name, email, password: secPass });

    const payload = { user: { id: user.id } };
    const authtoken = jwt.sign(payload, JWT_SECRET);

    success = true;
    res.json({ success, authtoken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


// ROUTE 2: Login using POST: "/api/auth/login"
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
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
      return res.status(400).json({ success, error: 'Invalid credentials' });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({ success, error: 'Invalid credentials' });
    }

    const payload = { user: { id: user.id } };
    const authtoken = jwt.sign(payload, JWT_SECRET);

    success = true;
    res.json({ success, authtoken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


// ROUTE 3: Get logged in user details using POST: "/api/auth/getuser"
router.post('/getuser', fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
