const jwt = require('jsonwebtoken');
const { RefreshToken } = require('../models');
require('dotenv').config();

const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || '15m';
const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES || '7d';

function signAccessToken(payload) {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_EXPIRES });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_EXPIRES });
}

function verifyAccessToken(token) {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
}

/**
 * Guarda refresh token en BD
 * @param {string} token
 * @param {number} id_usuario
 * @param {Date|null} expiresAt
 */
async function saveRefreshToken(token, id_usuario, expiresAt = null) {
  return RefreshToken.create({
    token,
    id_usuario,
    expires_at: expiresAt
  });
}

async function findRefreshToken(token) {
  return RefreshToken.findOne({ where: { token } });
}

async function deleteRefreshToken(token) {
  return RefreshToken.destroy({ where: { token } });
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  saveRefreshToken,
  findRefreshToken,
  deleteRefreshToken
};
