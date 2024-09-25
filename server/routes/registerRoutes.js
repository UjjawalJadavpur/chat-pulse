const bycrypt = require('bcrypt')
const express = require('express');
const { User } = require('../Schema/UserSchema.js');
const { generateTokeAndSetCookie } = require('../utils/jwtUtils');
require('dotenv').config();
const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please enter all fields' });
    }


    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(password, salt) 
    const newUser = new User({ name, email, password: hashedPassword });
    if (newUser) {
      // generateTokeAndSetCookie(newUser._id,res);
      await newUser.save();
    }

    res.status(201).json(newUser);
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Error registering user' });
  }
});

module.exports = router;
