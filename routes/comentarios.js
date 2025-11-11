const express = require('express');
const router = express.Router();
const comentarioController = require('../controllers/comentarioController');
const authenticate = require('../middlewares/authMiddleware');

router.post('/', authenticate, comentarioController.createComentario);
router.get('/post/:postId', comentarioController.listComentariosByPost);
router.delete('/:id', authenticate, comentarioController.deleteComentario);

module.exports = router;
