const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Usuario = sequelize.define('Usuario', {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre_usuario: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false
    },
    contrasena_hash: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    fecha_registro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    foto_perfil_url: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'usuarios'
  });

  return Usuario;
};
