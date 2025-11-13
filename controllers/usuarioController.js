const { Usuario } = require('../models');

async function getProfile(req, res, next) {
  try {
    const id = req.user && req.user.id_usuario;
    if (!id) return res.status(400).json({ message: 'Usuario no identificado' });

    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ['contrasena_hash'] }
    });
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ usuario });
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const id = req.user.id_usuario;
    const { nombre_usuario, foto_perfil_url } = req.body;
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    if (nombre_usuario) usuario.nombre_usuario = nombre_usuario;
    if (foto_perfil_url) usuario.foto_perfil_url = foto_perfil_url;
    await usuario.save();
    const safe = usuario.get({ plain: true });
    delete safe.contrasena_hash;
    res.json({ usuario: safe });
  } catch (err) {
    next(err);
  }
}

async function listUsers(req, res, next) {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['contrasena_hash'] },
      order: [['id_usuario', 'ASC']]
    });

    res.json({ usuarios });
  } catch (err) {
    next(err);
  }
}

async function getUser(req, res, next) {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ['contrasena_hash'] }
    });

    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json({ usuario });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProfile,
  updateProfile,
  listUsers,
  getUser
};
