const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');

const authController = {
  async register(req, res) {
    try {
      const { email, password, username } = req.body; // Changed 'name' to 'username'
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ email, password: hashedPassword, username }); // Changed 'name' to 'username'
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(201).json({ token, user: { id: user.id, email, username: user.username } }); // Changed 'name' to 'username'
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
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