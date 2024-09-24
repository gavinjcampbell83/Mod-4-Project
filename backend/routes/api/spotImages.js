const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Spots, spotImages, User } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

router.post('/:spotId/images', requireAuth, async (req, res) => {
    const spotTableId = parseInt(req.params.spotId);
    const spot = await Spots.findByPk(spotTableId);
    const { url, preview } = req.body;

    if(!spot){
        return res.status(404).json({
            "message": "Spot couldn't be found"
          });
    };

    const addImage = await spotImages.create({
        spotId: spotTableId,
        url,
        preview

    })
    res.status(201).json(addImage);
})


router.delete('/spot-images/:imageId', requireAuth, async (req, res) => {
    const imageId = parseInt(req.params.imageId);
    const deleteImage = await spotImages.findByPk(imageId);

    if(!deleteImage){
        return res.status(404).json({
            "message": "Spot Image couldn't be found"
          });
    }
    await deleteImage.destroy();
    res.status(200).json({
        "message": "Successfully deleted"
    });
});



















module.exports = router;