const { Usuario } = require('../models');
const { hashPassword, comparePassword } = require('../utils/hash');

async function registerUser({ nombre_usuario, email, password, foto_perfil_url }) {
  const contrasena_hash = await hashPassword(password);
  const usuario = await Usuario.create({
    nombre_usuario,
    email,
    contrasena_hash,
    foto_perfil_url
  });
  // No devolver contrasena_hash al cliente
  const { contrasena_hash: _, ...rest } = usuario.get({ plain: true });
  return rest;
}

async function validateUserLogin(identifier, password) {
  // identifier puede ser nombre_usuario o email
  const usuario = await Usuario.findOne({
    where: {
      // buscaremos por email o nombre_usuario
      // usamos raw query-like OR con Sequelize
      // Para simplicidad: intentar por email y si no, por nombre_usuario
    }
  });

  let found = await Usuario.findOne({ where: { email: identifier } });
  if (!found) found = await Usuario.findOne({ where: { nombre_usuario: identifier } });
  if (!found) return null;

  const ok = await comparePassword(password, found.contrasena_hash);
  if (!ok) return null;

  const userSafe = found.get({ plain: true });
  delete userSafe.contrasena_hash;
  return userSafe;
}

module.exports = {
  registerUser,
  validateUserLogin
};
