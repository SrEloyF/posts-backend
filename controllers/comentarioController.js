const { Comentario, Post } = require('../models');

async function createComentario(req, res, next) {
  try {
    const id_usuario = req.user.id_usuario;
    const { id_post, contenido } = req.body;
    if (!id_post || !contenido) return res.status(400).json({ message: 'Campos incompletos' });

    const post = await Post.findByPk(id_post);
    if (!post) return res.status(404).json({ message: 'Post no encontrado' });

    const comentario = await Comentario.create({ id_post, id_usuario, contenido });
    res.status(201).json({ comentario });
  } catch (err) {
    next(err);
  }
}

async function listComentariosByPost(req, res, next) {
  try {
    const id_post = req.params.postId;
    const comentarios = await Comentario.findAll({
      where: { id_post },
      order: [['fecha_creacion', 'ASC']]
    });
    res.json(comentarios);
  } catch (err) {
    next(err);
  }
}

async function deleteComentario(req, res, next) {
  try {
    const id = req.params.id;
    const comentario = await Comentario.findByPk(id);
    if (!comentario) return res.status(404).json({ message: 'Comentario no encontrado' });
    if (comentario.id_usuario !== req.user.id_usuario) return res.status(403).json({ message: 'No autorizado' });

    await comentario.destroy();
    res.json({ message: 'Comentario eliminado' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createComentario,
  listComentariosByPost,
  deleteComentario
};
