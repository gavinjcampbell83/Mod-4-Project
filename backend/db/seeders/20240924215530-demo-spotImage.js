'use strict';

const { spotImage } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await spotImage.bulkCreate([
    {
      spotId: 1,
      url: "https://media.istockphoto.com/id/1304565142/photo/brown-grizzly-bear-widely-open-mouth-near-a-wooden-house-collage.jpg?s=612x612&w=0&k=20&c=k1KWZ8_q6MoNt7TWdenZEUy_bWm3Oh8S7Yp1RZgru0k=",
      preview: true
    },
    {
      spotId: 2,
      url: "https://thumbs.dreamstime.com/b/arctodus-bear-goes-house-ai-generated-photo-k-portrait-front-view-hd-image-background-322967776.jpg",
      preview: true
    },
    {
      spotId: 3,
      url: "https://thumbs.dreamstime.com/b/group-brown-bears-climbing-up-tree-house-generative-ai-image-group-brown-bears-climbing-up-tree-house-generative-ai-280239292.jpg",
      preview: true
    }
    ], options)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'spotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
