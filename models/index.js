const { Sequelize } = require('sequelize');
const dbConfig = require('../config/config.js');

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    port: config.port || 3306,
    dialectOptions: config.dialect
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
  }
);


const defineUsuario = require('./Usuario');
const definePost = require('./Post');
const defineComentario = require('./Comentario');
const defineRefreshToken = require('./RefreshToken');

const Usuario = defineUsuario(sequelize);
const Post = definePost(sequelize);
const Comentario = defineComentario(sequelize);
const RefreshToken = defineRefreshToken(sequelize);

// Relaciones
Usuario.hasMany(Post, { foreignKey: 'id_usuario', sourceKey: 'id_usuario', onDelete: 'CASCADE' });
Post.belongsTo(Usuario, { foreignKey: 'id_usuario', targetKey: 'id_usuario' });

Post.hasMany(Comentario, { foreignKey: 'id_post', sourceKey: 'id_post', onDelete: 'CASCADE' });
Comentario.belongsTo(Post, { foreignKey: 'id_post', targetKey: 'id_post' });

Usuario.hasMany(Comentario, { foreignKey: 'id_usuario', sourceKey: 'id_usuario', onDelete: 'CASCADE' });
Comentario.belongsTo(Usuario, { foreignKey: 'id_usuario', targetKey: 'id_usuario' });

Usuario.hasMany(RefreshToken, { foreignKey: 'id_usuario', sourceKey: 'id_usuario', onDelete: 'CASCADE' });
RefreshToken.belongsTo(Usuario, { foreignKey: 'id_usuario', targetKey: 'id_usuario' });

module.exports = {
  sequelize,
  Usuario,
  Post,
  Comentario,
  RefreshToken
};
