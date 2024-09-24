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





module.exports = router;