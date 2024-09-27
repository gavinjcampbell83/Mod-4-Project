'use strict';
const { Model } = require('sequelize');
const user = require('./user');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(models.User, { foreignKey: 'ownerId'});
      Spot.hasMany(models.spotImage, {foreignKey: 'spotId'})
      Spot.hasMany(models.Review, { foreignKey: 'spotId', onDelete: 'CASCADE'})
    }
  }
  Spot.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: user, 
        key: 'id'
    },
  },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        min: -90,
        max: 90,
      },
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        min: -180,
        max: 180,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      length: 300,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  }, 
  {
    sequelize,
    validate: {
      bothCoordsOrNone() {
        if ((this.lat === null) !== (this.lng === null)) {
          throw new Error('Either both latitude and longitude, or neither!');
        }
      },
    },
    modelName: 'Spots',
  });
  return Spot;
};