const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authenticate = require('../middlewares/authMiddleware');

router.get('/', postController.listPosts);
router.get('/:id', postController.getPost);
router.post('/', authenticate, postController.createPost);
router.delete('/:id', authenticate, postController.deletePost);

module.exports = router;
