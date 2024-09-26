const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Spots, User, Review, spotImage, reviewImage } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const review = require('../../db/models/review');
const router = express.Router();


//Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res) => {
    
        console.log('made it here');
        const currentUser = req.user.username;
        console.log('made it here');
        
        const userReviews = await Review.findAll({           
            include: [
                {
                    model: User,
                    attributes: { exclude: ['createdAt', 'updatedAt', 'username', 'email', 'hashedPassword'] }
                },
                {
                    model: Spots,
                    attributes: { exclude: ['createdAt', 'updatedAt','description'] }
                },
                {
                    model: reviewImage,
                    attributes: { exclude: ['createdAt', 'updatedAt', 'reviewId'] }
                }
            ]  
        });

        res.status(200).json({ Reviews: userReviews });
    });
  





module.exports = router;