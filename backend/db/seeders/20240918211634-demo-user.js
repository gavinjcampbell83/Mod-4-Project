'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

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
   await User.bulkCreate([
    {
      firstName: 'Demo',
      lastName: 'Lition',
      email: 'demo@user.io',
      username: 'Demo-lition',
      hashedPassword: bcrypt.hashSync('password')
   },
   {
    firstName: 'Yogi',
    lastName: 'Bear',
    email: 'yogi@bear.io',
    username: 'yogibear',
    hashedPassword: bcrypt.hashSync('password')
    },
    {
      firstName: 'Smokey',
      lastName: 'Bear',
      email: 'smokey@bear.io',
      username: 'smokeybear',
      hashedPassword: bcrypt.hashSync('password')
    }, 
    {
      firstName: 'Berenstain',
      lastName: 'Bear',
      email: 'berenstain@bear.io',
      username: 'berenstainbear',
      hashedPassword: bcrypt.hashSync('password')
    },
    {
      firstName: 'Booboo',
      lastName: 'Bear',
      email: 'booboo@bear.io',
      username: 'booboobear',
      hashedPassword: bcrypt.hashSync('password')
    },
    {
      firstName: 'Paddington',
      lastName: 'Bear',
      email: 'paddington@bear.io',
      username: 'paddingtonbear',
      hashedPassword: bcrypt.hashSync('password')
    },
  ], {validate: true});
},

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
