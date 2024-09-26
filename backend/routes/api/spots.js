const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Spots, User, spotImage, Owner} = require('../../db/models')
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

// //get all spots
router.get('/', async (req, res) => {
    const spots = await Spots.findAll();
    res.status(200).json({ Spots: spots });
});


//get all Spots owned by the Current User

router.get('/current', restoreUser, async (req, res) => {
    const { user } = req;    
    if (!user) {
        return res.status(401).json({
            message: 'Authentication required',
            statusCode: 401
        });
    }

    const spots = await Spots.findAll({
        where: {
            ownerId: user.id
        }
    });
    return res.json({
        Spots: spots
    });
});

//Create a Spot
router.post('/', requireAuth, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const ownerId = req.user.id;

    if (!address || !city || !state || !country || !lat || !lng || !name || !description || !price) {
        const err = new Error("Bad Request");
        err.status = 400; 
        err.errors = {};
        if (!address) err.errors.address = "Street address is required";
        if (!city) err.errors.city = "City is required";
        if (!state) err.errors.state = "State is required";
        if (!country) err.errors.country = "Country is required";
        if (lat < -90 || lat > 90) err.errors.lat = "Latitude must be within -90 and 90";
        if (lng < -180 || lng > 180) err.errors.lng = "Longitude must be within -180 and 180";
        if (!name || name.length > 50) err.errors.name = "Name must be less than 50 characters";
        if (!description) err.errors.description = "Description is required";
        if (!price || price <= 0) err.errors.price = "Price per day must be a positive number";
        return next(err);
    }    
        const createSpot = await Spots.create({
            address, city, state, country, lat, lng, name, description, price, ownerId
        });
        res.status(201).json({ createSpot });
    
});


//Edit a Spot
router.put('/:spotId', requireAuth, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const spotId = parseInt(req.params.spotId);
    // console.log(spotId);

    const updatedSpot = await Spots.findByPk(spotId);
    // console.log(updatedSpot);

    if(!updatedSpot){
        return res.status(404).json({
            "message": "Spot couldn't be found"
          })
    }

    if (!address || !city || !state || !country || !lat || !lng || !name || !description || !price) {
        const err = new Error("Bad Request");
        err.status = 400; 
        err.errors = {};
        if (!address) err.errors.address = "Street address is required";
        if (!city) err.errors.city = "City is required";
        if (!state) err.errors.state = "State is required";
        if (!country) err.errors.country = "Country is required";
        if (lat < -90 || lat > 90) err.errors.lat = "Latitude must be within -90 and 90";
        if (lng < -180 || lng > 180) err.errors.lng = "Longitude must be within -180 and 180";
        if (!name || name.length > 50) err.errors.name = "Name must be less than 50 characters";
        if (!description) err.errors.description = "Description is required";
        if (!price || price <= 0) err.errors.price = "Price per day must be a positive number";
        return next(err);
    } 

    await updatedSpot.update({
        address, 
        city, 
        state, 
        country, 
        lat, 
        lng, 
        name, 
        description, 
        price
    })
    return res.status(200).json(updatedSpot)
})

//Delete a Spot
router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const spotId = parseInt(req.params.spotId);
    const deletedSpot = await Spots.findByPk(spotId);

    if(!deletedSpot){
        return res.status(404).json({
            "message": "Spot couldn't be found"
          })
    }

    await deletedSpot.destroy();
    res.status(200).json({
        "message": "Successfully deleted"
      })
});

//Get details of a Spot from an id
router.get('/:spotId', requireAuth, async (req, res, next) => {
    
        const spotId = req.params.spotId;
        
        if(!spotId){
            return res.status(404).json({
                "message": "Spot couldn't be found"
              })
        }
        console.log("hit the route");
        const details = await Spots.findByPk(spotId, {
           
            include: [
                {
                    model: User, 
                    as: Owner,                  
                    attributes: { exclude: ['createdAt', 'updatedAt', 'username', 'email', 'hashedPassword'] }
                },
                {
                    model: spotImage, 
                    attributes: { exclude: ['createdAt', 'updatedAt', 'spotId'] }
                }
            ]
            
        })
        console.log("hit the route");
    res.status(200).json(details);
});                                                                                                                
                                                                                      

       

   
module.exports = router;