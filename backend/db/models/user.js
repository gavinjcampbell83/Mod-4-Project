'use strict';
const { Model, Validator } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Spots, { foreignKey: 'ownerId'});
      //User.hasMany(models.Spots, { as: 'Owner'});
      User.hasMany(models.Review, { foreignKey: 'userId'});
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    firstName:{
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [4, 30],
      isNotEmail(value) {
        if(Validator.isEmail(value)) {
          throw new Error('Must not be email')
        }
      },
    },
  },
    email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 256],
      isEmail: true,
    },
  },
    hashedPassword: {
    type: DataTypes.STRING.BINARY,
    allowNull: false,
    validate: {
      len: [60, 60],
    },
  },
}, 
{
    sequelize,
    modelName: 'User',
    defaultScope:{
      attributes: {
        exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt'],
      },
    },
  }
);
  return User;
};