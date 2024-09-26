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
    const currentUser = req.user.username;
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

//Create a Review for a Spot based on the Spot's id
router.post('/spots/:spotId/reviews', requireAuth, async (req, res, next) => {
    const { review, stars } = req.body;
    const { spotId } = req.params;
    const userId = req.user.id;
    console.log("did it agin")

    if (!review || !stars) {
        const err = new Error("Bad Request");
        err.status = 400;
        err.errors = {};
        if (!review) err.errors.review = "Review text is required";
        if (!stars) err.errors.stars = "Stars must be an integer from 1 to 5";
        return next(err);
    }
console.log("did it agin1")


    const spot = await Spots.findByPk(spotId);
    if (!spot) {
        return res.status(404).json({
        "message": "Spot couldn't be found"
        });
    }
    console.log("did it agin2")

    const existingReview = await Review.findOne({
        where: { spotId, userId }
    });

    if (existingReview) {
        return res.status(500).json({
        "message": "User already has a review for this spot"
        });
    }
console.log("did it agin3")

    const createReview = await Review.create({
        review, stars               
    });
    res.status(201).json(createReview);    
});
  





module.exports = router;