const express = require('express');
const router = express.Router();
const targetController = require('../controllers/targetController');
const authMiddleware = require('../middleware/authMiddleware'); 

router.get('/', authMiddleware.protect, targetController.getAllTargets);
router.post('/', authMiddleware.protect, targetController.createTarget);
router.put('/:id', authMiddleware.protect, targetController.updateTarget);
router.delete('/:id', authMiddleware.protect, targetController.deleteTarget);

module.exports = router;