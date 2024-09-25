'use strict';

const {Booking} = require('../models');

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
   await Booking.bulkCreate([
    {
      spotId: 3,
      userId: 1,
      startDate: '2024-30-9',
      EndDate: '2024-10-10'
    },
    {
      spotId: 1,
      userId: 2,
      startDate: '2024-28-9',
      EndDate: '2024-5-10'
    },
    {
      spotId: 2,
      userId: 3,
      startDate: '2024-09-30',
      EndDate: '2024-10-10'
    },
    {
      spotId: 3,
      userId: 1,
      startDate: '2024-10-10',
      EndDate: '2024-20-10'
    }
   ], options);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] },
      userId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
