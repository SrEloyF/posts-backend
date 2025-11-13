const express = require('express');
const router = express.Router();
const auth = require('./auth');
const usuarios = require('./usuarios');
const posts = require('./posts');
const comentarios = require('./comentarios');

router.use('/auth', auth);
router.use('/users', usuarios);
router.use('/posts', posts);
router.use('/comments', comentarios);

module.exports = router;
