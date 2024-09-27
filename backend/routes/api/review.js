const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Spots, User, Review, spotImage, reviewImage } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const review = require('../../db/models/review');
const { where } = require('sequelize');
const router = express.Router();

// //Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res) => {
    const currentUser = req.user.username;

    const userReviews = await Review.findAll({
        include: [
            {
                model: User,
                where: { username: currentUser },
                attributes: { exclude: ['createdAt', 'updatedAt', 'username', 'email', 'hashedPassword'] }
            },
            {
                model: Spots,
                attributes: { exclude: ['createdAt', 'updatedAt', 'description'] },
                include: [
                    {
                        model: spotImage,
                        attributes: ['url', 'preview'] 
                    }
                ]
            },
            {
                model: reviewImage,
                attributes: { exclude: ['createdAt', 'updatedAt', 'reviewId'] }
            }
        ]
    });

    const formattedReviews = userReviews.map(review => {
        const reviewData = review.toJSON();

        const previewImageObj = reviewData.Spot.spotImages?.find(image => image.preview === true) || null;

        return {
            id: reviewData.id,
            userId: reviewData.userId,
            spotId: reviewData.spotId,
            review: reviewData.review,
            stars: reviewData.stars,
            createdAt: reviewData.createdAt,
            updatedAt: reviewData.updatedAt,
            User: {
                id: reviewData.User.id,
                firstName: reviewData.User.firstName,
                lastName: reviewData.User.lastName
            },
            Spot: {
                id: reviewData.Spot.id,
                ownerId: reviewData.Spot.ownerId,
                address: reviewData.Spot.address,
                city: reviewData.Spot.city,
                state: reviewData.Spot.state,
                country: reviewData.Spot.country,
                lat: reviewData.Spot.lat,
                lng: reviewData.Spot.lng,
                name: reviewData.Spot.name,
                price: reviewData.Spot.price,
                previewImage: previewImageObj ? previewImageObj.url : null  
            },
            ReviewImages: reviewData.reviewImages || []  
        };
    });

    res.status(200).json({ Reviews: formattedReviews });
});

                       
//Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res, next) => {   
    const { spotId } = req.params; 

    const spot = await Spots.findByPk(spotId);    

    if (!spot) {
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
    //  rename `reviewImages`
    const formattedReviews = reviews.map(review => {
        const reviewObj = review.toJSON();  
        reviewObj.ReviewImages = reviewObj.reviewImages;  
        delete reviewObj.reviewImages;  
        return reviewObj;
    });

    return res.json({ Reviews: formattedReviews });
});

//Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, async (req, res, next) => {
    const { review, stars } = req.body;

    const spotId = Number(req.params.spotId);   
    const userId = req.user.id;
    
    if (!review || typeof review !== 'string' || !stars || isNaN(stars) || stars < 1 || stars > 5) {
        
        const err = new Error("Bad Request");
        err.status = 400;
        err.errors = {};
        if (!review || typeof review !== 'string') err.errors.review = "Review text is required";
        if (!stars || isNaN(stars) || stars < 1 || stars > 5) {
            err.errors.stars = "Stars must be an integer from 1 to 5";
        } 
        return next(err);
    }

    const spot = await Spots.findByPk(req.params.spotId);
    if (!spot) {
        return res.status(404).json({
        "message": "Spot couldn't be found"
        });
    }


    const existingReview = await Review.findOne({
        where: { spotId, userId }
    });

    if (existingReview) {
        return res.status(500).json({
        "message": "User already has a review for this spot"
        });
    }


    const createReview = await Review.create({
        spotId, userId, review, stars               
    });
    res.status(201).json(createReview);    
});
  

//Add an Image to a Review based on the Review's Id
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    
    const reviewId = parseInt(req.params.reviewId);
    const { url } = req.body;
    const userId = req.user.id;

    const review = await Review.findByPk(reviewId);
    
    if(!review){
        return res.status(404).json({
             "message": "Review couldn't be found"
            });
    }

    if (userId !== review.userId) {
        return res.status(403).json({
            "message": "Forbidden"
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

//Edit a Review
router.put('/:reviewId', requireAuth, async (req, res, next) => {
    
    const reviewId = parseInt(req.params.reviewId);
    const { review, stars } = req.body;
    const userId = req.user.id

    const updatedReview = await Review.findByPk(reviewId)
    
    if (!updatedReview) {
        return res.status(404).json({
        "message": "Review couldn't be found"
        });
    }

    if (userId !== updatedReview.userId) {
        return res.status(403).json({
            "message": "Forbidden"
        });
    }
   
    if (!review || typeof review !== 'string' || !stars || isNaN(stars) || stars < 1 || stars > 5) {
        
        const err = new Error("Bad Request");
        err.status = 400;
        err.errors = {};
        if (!review || typeof review !== 'string') err.errors.review = "Review text is required";
        if (!stars || isNaN(stars) || stars < 1 || stars > 5) {
            err.errors.stars = "Stars must be an integer from 1 to 5";
        } 
        return next(err);
    }

    await updatedReview.update({
        review,
        stars
    })
    return res.status(200).json(updatedReview);
});

//Delete a Review
router.delete('/:reviewId', requireAuth, async (req, res) => {
    const reviewId = parseInt(req.params.reviewId);
    const userId = req.user.id;

    const deletedReview = await Review.findByPk(reviewId);

    if(!deletedReview){
        return res.status(404).json({
            "message": "Review couldn't be found"
          })
    }

    if (userId !== deletedReview.userId) {
        return res.status(403).json({
            "message": "Forbidden"
        });
    }

    await deletedReview.destroy();
    res.status(200).json({
        "message": "Successfully deleted"
      })
})



module.exports = router;