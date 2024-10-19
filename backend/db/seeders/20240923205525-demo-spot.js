'use strict';

const { Spots } = require('../models')


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
   await Spots.bulkCreate([
    {
      ownerId: 1,
      address: "1234 Lombard street",
      city: "San Francisco",
      state: "California",
      country: "United States",
      lat: 37.7645358,
      lng: -122.4730327,
      name: "Dowtown Loft",
      description: "Great views of the city, wifi and more.",
      price: 345,
    },
    {
      ownerId: 2,
      address: "1234 Bear lane",
      city: "Yosemite",
      state: "California",
      country: "United States",
      lat: 40.730610,
      lng: -73.935242,
      name: "Cabin in the woods",
      description: "Great views and great fun for the whole bear family.",
      price: 150,
    },
    {
      ownerId: 3,
      address: "1234 Bear place",
      city: "Bozeman",
      state: "Montana",
      country: "United States",
      lat: 40.377010,
      lng: -105.522087,
      name: "Glamping with the bear family",
      description: "Great place to glamp in style with your bear family.",
      price: 115,
    },
    {
      ownerId: 4,
      address: "1234 Bear avenue",
      city: "Estes Park",
      state: "Colorado",
      country: "United States",
      lat: 40.377010,
      lng: -105.522087,
      name: "Mountain Cabin",
      description: "Great views of the river, and close to main street.",
      price: 175,
    },
    {
      ownerId: 5,
      address: "1234 Bear place",
      city: "Fort Collins",
      state: "Colorado",
      country: "United States",
      lat: 40.377010,
      lng: -105.522087,
      name: "Booboo House",
      description: "Great bear spot, close to campus!",
      price: 150,
    },
    {
      ownerId: 6,
      address: "1234 Bear lane",
      city: "Monument",
      state: "Colorado",
      country: "United States",
      lat: 40.377010,
      lng: -105.522087,
      name: "Townhome",
      description: "Nice little bear spot!",
      price: 150,
    },
    {
      ownerId: 2,
      address: "1234 Bear lane",
      city: "Santa Cruz",
      state: "California",
      country: "United States",
      lat: 40.377010,
      lng: -105.522087,
      name: "Beach House",
      description: "Close to the ocean, and the boardwalk!",
      price: 150,
    },
    {
      ownerId: 3,
      address: "1234 Bear circle",
      city: "Port Louis",
      state: "Mauritius",
      country: "Mauritius",
      lat: 40.377010,
      lng: -105.522087,
      name: "Paradise",
      description: "Great hiking, waterfalls, and clear blue oceans!",
      price: 225,
    },
   ], options);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
