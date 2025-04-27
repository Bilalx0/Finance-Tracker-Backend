const express = require('express');
const router = express.Router();
const targetController = require('../controllers/targetController');
const authMiddleware = require('../middleware/authMiddleware'); // Assuming you have authentication

router.get('/targets', authMiddleware, targetController.getAllTargets);
router.post('/targets', authMiddleware, targetController.createTarget);
router.put('/targets/:id', authMiddleware, targetController.updateTarget);
router.delete('/targets/:id', authMiddleware, targetController.deleteTarget);

module.exports = router;