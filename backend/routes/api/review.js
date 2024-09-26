const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Spots, User, Review, spotImage, reviewImage } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const review = require('../../db/models/review');
const { where } = require('sequelize');
const router = express.Router();


//Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res) => {
    // console.log(req)
    const currentUser = req.user.username
    // console.log('Current User------>', currentUser)
    const userReviews = await Review.findAll({
        // where: { currentUser },
        include: [
                {
                    model: User,
                    where: { username: currentUser },
                    attributes: { exclude: ['createdAt', 'updatedAt', 'username', 'email', 'hashedPassword'] }
                },
                {
                    model: Spots,
                    // where: { userId: req.user.id },
                    attributes: { exclude: ['createdAt', 'updatedAt','description'] }
                },
                {
                    model: reviewImage,
                    // where: { userId: req.user.id },
                    attributes: { exclude: ['createdAt', 'updatedAt', 'reviewId'] }
                }
            ]  
        });
        res.status(200).json({ Reviews: userReviews });
});

//Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res, next) => {
    // console.log("do I make it")
    const { spotId } = req.params;
    // console.log(spotId);
    const spot = await Spots.findByPk(spotId);
    // console.log(spot)
    if(!spot){
        return res.status(404).json({
            "message": "Spot couldn't be found"
            });
    }
    const reviews = await Review.findAll({
        where: { spotId },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: reviewImage,
                attributes: ['id', 'url']
            }
        ]
    });
    return res.json({ Reviews: reviews})
});

//Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, async (req, res, next) => {
    const { review, stars } = req.body;
    const spotId = Number(req.params.spotId);
    // console.log(typeof spotId)
    const userId = req.user.id;
    // console.log("did it agin")

    if (!review || !stars) {
        const err = new Error("Bad Request");
        err.status = 400;
        err.errors = {};
        if (!review) err.errors.review = "Review text is required";
        if (!stars) err.errors.stars = "Stars must be an integer from 1 to 5";
        return next(err);
    }
// console.log("did it agin1")


    const spot = await Spots.findByPk(req.params.spotId);
    if (!spot) {
        return res.status(404).json({
        "message": "Spot couldn't be found"
        });
    }
    // console.log("did it agin2")

    const existingReview = await Review.findOne({
        where: { spotId, userId }
    });

    if (existingReview) {
        return res.status(500).json({
        "message": "User already has a review for this spot"
        });
    }
// console.log("did it agin3")

    const createReview = await Review.create({
        spotId, userId, review, stars               
    });
    res.status(201).json(createReview);    
});
  
//Add an Image to a Review based on the Review's Id
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    // console.log('hello');
    const { reviewId } = req.params;
    const { url } = req.body;
    // console.log(reviewId)
    const review = await Review.findByPk(reviewId);
    console.log(review)
    if(!review){
        return res.status(404).json({
             "message": "Review couldn't be found"
            });
    }
    const imageCount = await reviewImage.count({ where: {reviewId } });
    if (imageCount >= 10){
        return res.status(403).json({
            "message": "Maximum number of images for this resource was reached"
        });
    }
    
    const newImage = await reviewImage.create({
        reviewId,
        url
    })
    return res.status(201).json({
        id: newImage.id,
        url: newImage.url
    });
});




module.exports = router;