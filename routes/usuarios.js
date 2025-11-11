const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authenticate = require('../middlewares/authMiddleware');

router.get('/me', authenticate, usuarioController.getProfile);
router.put('/me', authenticate, usuarioController.updateProfile);

module.exports = router;
