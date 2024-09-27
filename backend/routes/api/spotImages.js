const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Spots, spotImage, User } = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();


//Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, async (req, res) => {
    // console.log(req.params)
    const spotTableId = parseInt(req.params.spotId);
    // console.log(spotTableId)
    const spot = await Spots.findByPk(spotTableId);
    const { url, preview } = req.body;

    if(!spot){
        return res.status(404).json({
            "message": "Spot couldn't be found"
          });
    };

    const addImage = await spotImage.create({
        spotId: spotTableId,
        url,
        preview
    })
    const response = {
        id: addImage.id,
        url: addImage.url,
        preview: addImage.preview
    }

    return res.status(201).json(response);
})


//Delete a Spot Image
router.delete('/:imageId', requireAuth, async (req, res) => {
    const imageId = parseInt(req.params.imageId);
    const deleteImage = await spotImage.findByPk(imageId);

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