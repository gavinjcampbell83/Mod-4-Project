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

    // Fetch the reviews by the current user along with associated User, Spot, ReviewImages, and SpotImages
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
                        attributes: ['url', 'preview']  // Get the URL and preview status
                    }
                ]
            },
            {
                model: reviewImage,
                attributes: { exclude: ['createdAt', 'updatedAt', 'reviewId'] }
            }
        ]
    });

    // Format the response to include previewImages
    const formattedReviews = userReviews.map(review => {
        const reviewData = review.toJSON();

        // Get the preview image from the associated spotImages
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
                previewImage: previewImageObj ? previewImageObj.url : null  // Include preview image if available
            },
            ReviewImages: reviewData.reviewImages || []  // Include all review images
        };
    });

    // Return the formatted reviews
    res.status(200).json({ Reviews: formattedReviews });
});

// router.get('/current', requireAuth, async (req, res) => {

//     // console.log(req)
//     const currentUser = req.user.username
//     // console.log('Current User------>', currentUser)
//     const userReviews = await Review.findAll({
//         // where: { currentUser },
//         include: [
//                 {
//                     model: User,
//                     where: { username: currentUser },
//                     attributes: { exclude: ['createdAt', 'updatedAt', 'username', 'email', 'hashedPassword'] }
//                 },
//                 {
//                     model: Spots,
//                     // where: { userId: req.user.id },
//                     attributes: { exclude: ['createdAt', 'updatedAt','description'] }
//                 },
//                 {
//                     model: reviewImage,
//                     // where: { userId: req.user.id },
//                     attributes: { exclude: ['createdAt', 'updatedAt', 'reviewId'] }
//                 }
//             ]  
//         });
//         res.status(200).json({ Reviews: userReviews });
// });

                       
//Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res, next) => {   
    const { spotId } = req.params; 

    const spot = await Spots.findByPk(spotId);    

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
    const userId = req.user.id;
    

    if (!review || !stars) {
        const err = new Error("Bad Request");
        err.status = 400;
        err.errors = {};
        if (!review) err.errors.review = "Review text is required";
        if (!stars) err.errors.stars = "Stars must be an integer from 1 to 5";
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

//Edit a Review
router.put('/:reviewId', requireAuth, async (req, res, next) => {
    // console.log('hello')
   const reviewId = req.params.reviewId;
   const { review, stars } = req.body;
//    console.log(reviewId);
    const updatedReview = await Review.findByPk(reviewId)
    // console.log(updatedReview)
    if (!review || !stars) {
        const err = new Error("Bad Request");
        err.status = 400;
        err.errors = {};
        if (!review) err.errors.review = "Review text is required";
        if (!stars) err.errors.stars = "Stars must be an integer from 1 to 5";
        return next(err);
    }
    if (!updatedReview) {
        return res.status(404).json({
        "message": "Review couldn't be found"
        });
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
    const deletedReview = await Review.findByPk(reviewId);

    if(!deletedReview){
        return res.status(404).json({
            "message": "Review couldn't be found"
          })
    }

    await deletedReview.destroy();
    res.status(200).json({
        "message": "Successfully deleted"
      })
})







module.exports = router;