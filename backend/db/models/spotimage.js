'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association here
      SpotImage.belongsTo(models.Spots, { foreignKey: 'spotId' });
    }
  }

  SpotImage.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      preview: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Consider adding a default value for clarity
      },
    },
    {
      sequelize,
      modelName: 'spotImage', // Use PascalCase for model name
    }
  );

  return SpotImage;
};