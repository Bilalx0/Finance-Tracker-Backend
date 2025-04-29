const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');

const authController = {
  async register(req, res) {
    try {
      console.log('Register attempt with payload:', req.body);
      const { email, password, username } = req.body; // Changed 'name' to 'username'
      
      if (!email || !password || !username) {
        console.error('Missing required fields:', { email: !!email, password: !!password, username: !!username });
        return res.status(400).json({ message: 'All fields are required' });
      }
      
      console.log(`Checking if user exists with email: ${email}`);
      const existingUser = await User.findOne({ where: { email } });
      
      if (existingUser) {
        console.log(`User already exists with email: ${email}`);
        return res.status(400).json({ message: 'User already exists' });
      }
      
      console.log('Creating new user with username:', username);
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ email, password: hashedPassword, username }); // Changed 'name' to 'username'
      
      console.log('User created successfully, generating token');
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      console.log('Sending response with user data');
      res.status(201).json({ token, user: { id: user.id, email, username: user.username } }); // Changed 'name' to 'username'
    } catch (error) {
      console.error('Registration error details:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async login(req, res) {
    try {
      console.log('Login attempt with payload:', req.body);
      const { email, password } = req.body;
      
      if (!email || !password) {
        console.error('Missing required fields:', { email: !!email, password: !!password });
        return res.status(400).json({ message: 'Email and password are required' });
      }
      
      console.log(`Finding user with email: ${email}`);
      const user = await User.findOne({ where: { email } });
      
      if (!user) {
        console.log(`No user found with email: ${email}`);
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      
      console.log('User found, comparing password');
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        console.log('Password does not match');
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      
      console.log('Password match, generating token');
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      console.log('Login successful, sending response');
      res.json({ 
        token, 
        user: { 
          id: user.id, 
          email, 
          username: user.username,
          avatar: user.avatar 
        } 
      });
    } catch (error) {
      console.error('Login error details:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async profile(req, res) {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ 
        id: user.id, 
        email: user.email, 
        username: user.username,
        avatar: user.avatar 
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  
  async uploadAvatar(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Get the filename of the uploaded file
      const avatarPath = `/uploads/${req.file.filename}`;
      
      // Update user with new avatar path
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // If user already had an avatar, delete the old file
      if (user.avatar) {
        const oldAvatarPath = path.join(__dirname, '..', user.avatar);
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
        }
      }

      // Update user with new avatar path
      await user.update({ avatar: avatarPath });
      
      res.json({ 
        message: 'Avatar uploaded successfully', 
        avatar: avatarPath,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          avatar: avatarPath
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getAvatar(req, res) {
    try {
      const userId = req.params.id;
      const user = await User.findByPk(userId);
      
      if (!user || !user.avatar) {
        return res.status(404).json({ message: 'Avatar not found' });
      }
      
      const avatarPath = path.join(__dirname, '..', user.avatar);
      
      if (!fs.existsSync(avatarPath)) {
        return res.status(404).json({ message: 'Avatar file not found' });
      }

      res.sendFile(avatarPath);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = authController;