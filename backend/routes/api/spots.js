const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { Spots } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
// const spots = require('../../db/models/spots');
const router = express.Router();

// //get all spots
// router.get('/', async (req, res) => {
//     console.log('can i make it?')
//     const spot = await Spot.findAll({
//     // include: [{ model: Review.avgreview}, { model: image.url}]
    
//     }) 
//     res.status(200).json({ Spots: spot })
// });

router.get('/', async (req, res) => {
    console.log('Hello World')
    const spots = await Spots.findAll();
    res.status(200).json({ Spots: spots });
});





module.exports = router;