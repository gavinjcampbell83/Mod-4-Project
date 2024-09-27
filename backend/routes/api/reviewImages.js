
const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Spots, User, Review, spotImage, reviewImage } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const review = require('../../db/models/review');
const { where } = require('sequelize');
const router = express.Router();


//Delete a Review Image
router.delete('/:imageId', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const imageId = parseInt(req.params.imageId);
    const deleteImage = await reviewImage.findByPk(imageId);
    
    if(!deleteImage){
        return res.status(404).json({
            "message": "Review Image couldn't be found"
          });
    }
    
    const review = await Review.findByPk(deleteImage.reviewId)
    
    if (userId !== review.userId) {
        return res.status(403).json({
            "message": "Forbidden"
        });
    }

    await deleteImage.destroy();
    res.status(200).json({
        "message": "Successfully deleted"
    });
});





module.exports = router;