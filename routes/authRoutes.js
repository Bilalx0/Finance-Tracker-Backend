const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/signup', authController.register); // Changed '/register' to '/signup'
router.post('/login', authController.login);     // Already '/login', no change needed
router.get('/protected', authenticateToken, authController.profile); // Changed '/profile' to '/protected'

module.exports = router;