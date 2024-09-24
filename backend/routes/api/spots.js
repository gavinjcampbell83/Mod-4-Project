const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const { Spots } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
// const spots = require('../../db/models/spots');
const router = express.Router();

// //get all spots
router.get('/', async (req, res) => {
    const spots = await Spots.findAll();
    res.status(200).json({ Spots: spots });
});

router.get('/current', restoreUser, async (req, res) => {
    const { user } = req;
    console.log('USER------>', user);
    if (!user) {
        return res.status(401).json({
            message: 'Authentication required',
            statusCode: 401
        });
    }

    const spots = await Spots.findAll({
        where: {
            ownerId: user.id
        }
    });
    return res.json({
        Spots: spots
    });
});

router.post('/', requireAuth, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const createSpot = await Spots.create({
        address, city, state, country, lat, lng, name, description, price})

        res.status(201).json({ createSpot });
});

   
module.exports = router;