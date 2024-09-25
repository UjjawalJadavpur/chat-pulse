// routes/login.js
const bcrypt = require('bcrypt');
const express = require('express');
const { User } = require('../Schema/UserSchema');
const { generateToken } = require('../utils/jwtUtils');

const router = express.Router();

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter both email and password' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Generate JWT token
    const token = generateToken(user._id);
    res.status(200).json({ message: 'Successfully logged in', user, token });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
