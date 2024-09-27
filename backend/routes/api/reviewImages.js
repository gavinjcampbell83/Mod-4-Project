
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
    const imageId = parseInt(req.params.imageId);
    const deleteImage = await reviewImage.findByPk(imageId);

    if(!deleteImage){
        return res.status(404).json({
            "message": "Review Image couldn't be found"
          });
    }
    await deleteImage.destroy();
    res.status(200).json({
        "message": "Successfully deleted"
    });
});





module.exports = router;