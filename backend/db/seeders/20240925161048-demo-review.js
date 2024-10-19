'use strict';

const { Review } = require('../models');

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
    await Review.bulkCreate([
      {
        spotId: 2,
        userId: 1,
        review: 'Amazing spot, had a great time!',
        stars: 5,
      },
      {
        spotId: 1,
        userId: 2,
        review: 'Decent spot, could use improvements',
        stars: 3,
      },
      {
        spotId: 2,
        userId: 3,
        review: 'Not a great experience',
        stars: 2,
      },
      {
        spotId: 1,
        userId: 3,
        review: 'Had a good experience',
        stars: 4,
      },  {
        spotId: 3,
        userId: 1,
        review: 'Amazing spot, had a great time!',
        stars: 5,
      },
      {
        spotId: 3,
        userId: 2,
        review: 'decent experience',
        stars: 3,
      },
    ], options)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] },
      userId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
