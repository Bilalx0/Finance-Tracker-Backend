const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../utils/multerConfig');

router.post('/signup', authController.register); // Changed '/register' to '/signup'
router.post('/login', authController.login);     // Already '/login', no change needed
router.get('/protected', authMiddleware.protect, authController.profile); // Changed '/profile' to '/protected'

// Avatar routes
router.post('/upload-avatar', authMiddleware.protect, upload.single('avatar'), authController.uploadAvatar);
router.get('/avatar/:id', authController.getAvatar);

module.exports = router;