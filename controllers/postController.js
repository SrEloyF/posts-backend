const { Post, Usuario, Comentario } = require('../models');

async function createPost(req, res, next) {
  try {
    const id_usuario = req.user.id_usuario;
    const { titulo, descripcion, imagen_url } = req.body;
    if (!titulo) return res.status(400).json({ message: 'El título es obligatorio' });

    const post = await Post.create({ id_usuario, titulo, descripcion, imagen_url });
    res.status(201).json({ post });
  } catch (err) {
    next(err);
  }
}

async function listPosts(req, res, next) {
  try {
    const posts = await Post.findAll({
      include: [
        { model: Usuario, attributes: ['id_usuario', 'nombre_usuario', 'foto_perfil_url'] },
        //{ model: Comentario } el listado completo no se listará con comentarios, pues se obtendrán dinámicamente
      ],
      order: [['fecha_creacion', 'DESC']]
    });
    res.json(posts);
  } catch (err) {
    next(err);
  }
}

async function getPost(req, res, next) {
  try {
    const id = req.params.id;
    const post = await Post.findByPk(id, {
      include: [
        { model: Usuario, attributes: ['id_usuario', 'nombre_usuario', 'foto_perfil_url'] },
        { model: Comentario }
      ]
    });
    if (!post) return res.status(404).json({ message: 'Post no encontrado' });
    res.json(post);
  } catch (err) {
    next(err);
  }
}

async function deletePost(req, res, next) {
  try {
    const id = req.params.id;
    const post = await Post.findByPk(id);
    if (!post) return res.status(404).json({ message: 'Post no encontrado' });
    if (post.id_usuario !== req.user.id_usuario) return res.status(403).json({ message: 'No autorizado' });

    await post.destroy();
    res.json({ message: 'Post eliminado' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createPost,
  listPosts,
  getPost,
  deletePost
};
