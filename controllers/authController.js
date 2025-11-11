const { registerUser, validateUserLogin } = require('../services/authService');
const {
  signAccessToken,
  signRefreshToken,
  saveRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
  verifyRefreshToken
} = require('../services/tokenService');

const REFRESH_COOKIE_NAME = 'refreshToken';

function cookieOptions(req) {
  const secure = (process.env.COOKIE_SECURE === 'true');
  return {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 días en ms (ajustar según REFRESH_TOKEN_EXPIRES)
  };
}

async function register(req, res, next) {
  try {
    const { nombre_usuario, email, password, foto_perfil_url } = req.body;
    if (!nombre_usuario || !email || !password) {
      return res.status(400).json({ message: 'Campos incompletos' });
    }
    const user = await registerUser({ nombre_usuario, email, password, foto_perfil_url });
    res.status(201).json({ user });
  } catch (err) {
    // gestión simple de errores de unicidad
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Nombre de usuario o email ya existe' });
    }
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { identifier, password } = req.body; // identifier = email o nombre_usuario
    if (!identifier || !password) return res.status(400).json({ message: 'Campos incompletos' });

    const user = await validateUserLogin(identifier, password);
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

    const payload = { id_usuario: user.id_usuario, nombre_usuario: user.nombre_usuario, email: user.email };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken({ id_usuario: user.id_usuario });

    // Guardar refresh token en BD
    await saveRefreshToken(refreshToken, user.id_usuario, null);

    // Enviar refresh token como cookie httpOnly
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, cookieOptions(req));
    res.json({ accessToken, user });
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const token = req.cookies && req.cookies[REFRESH_COOKIE_NAME];
    if (!token) return res.status(401).json({ message: 'No refresh token' });

    const stored = await findRefreshToken(token);
    if (!stored) return res.status(401).json({ message: 'Refresh token inválido' });

    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch (err) {
      // Invalid token: remove from DB
      await deleteRefreshToken(token);
      return res.status(401).json({ message: 'Refresh token inválido o expirado' });
    }

    const newAccess = signAccessToken({ id_usuario: payload.id_usuario });
    // Opcional: rotar refresh token
    // const newRefresh = signRefreshToken({ id_usuario: payload.id_usuario });
    // await deleteRefreshToken(token);
    // await saveRefreshToken(newRefresh, payload.id_usuario);
    // res.cookie(REFRESH_COOKIE_NAME, newRefresh, cookieOptions(req));

    res.json({ accessToken: newAccess });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    const token = req.cookies && req.cookies[REFRESH_COOKIE_NAME];
    if (token) {
      await deleteRefreshToken(token);
      res.clearCookie(REFRESH_COOKIE_NAME);
    }
    res.json({ message: 'Sesión cerrada' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  refresh,
  logout
};
