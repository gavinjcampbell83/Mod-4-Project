const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Spots, User, spotImage, Review } = require('../../db/models')
const router = express.Router();
const { Sequelize, fn, col } = require('sequelize'); 
const { avgRatings, reviewCount } = require('../../utils/helperfuncs'); // Adjust the path as needed

//get all spots with avgStars and Preview image
router.get('/', async (req, res) => {
    const { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    const errors = {};

    if (page) {
        const pageNumber = Number(page);
        if (isNaN(pageNumber) || pageNumber < 1) {
            errors.page = "Page must be a number greater than or equal to 1";
        }
    }
    
    if (size) {
        const pageSize = Number(size);
        if (isNaN(pageSize) || pageSize < 1 || pageSize > 20) {
            errors.size = "Size must be a number between 1 and 20";
        }
    }

    if (minLat && (isNaN(minLat) || Number(minLat) < -90 || Number(minLat) > 90)) {
        errors.minLat = "Minimum latitude is invalid";
    }
    if (maxLat && (isNaN(maxLat) || Number(maxLat) < -90 || Number(maxLat) > 90)) {
        errors.maxLat = "Maximum latitude is invalid";
    }
    if (minLng && (isNaN(minLng) || Number(minLng) < -180 || Number(minLng) > 180)) {
        errors.minLng = "Minimum longitude is invalid";
    }
    if (maxLng && (isNaN(maxLng) || Number(maxLng) < -180 || Number(maxLng) > 180)) {
        errors.maxLng = "Maximum longitude is invalid";
    }
    if (minPrice && (isNaN(minPrice) || Number(minPrice) < 0)) {
        errors.minPrice = "Minimum price must be greater than or equal to 0";
    }
    if (maxPrice && (isNaN(maxPrice) || Number(maxPrice) < 0)) {
        errors.maxPrice = "Maximum price must be greater than or equal to 0";
    }

    if (Object.keys(errors).length) {
        return res.status(400).json({
            message: "Bad Request",
            errors
        });
    }

    const pageNumber = page ? Number(page) : 1;  
    const pageSize = size ? Number(size) : 20;   

    const limit = pageSize;
    const offset = (pageNumber - 1) * limit;

    const whereConditions = {};
    if (minLat) whereConditions.lat = { [Sequelize.Op.gte]: minLat };
    if (maxLat) whereConditions.lat = { [Sequelize.Op.lte]: maxLat };
    if (minLng) whereConditions.lng = { [Sequelize.Op.gte]: minLng };
    if (maxLng) whereConditions.lng = { [Sequelize.Op.lte]: maxLng };
    if (minPrice) whereConditions.price = { [Sequelize.Op.gte]: minPrice };
    if (maxPrice) whereConditions.price = { [Sequelize.Op.lte]: maxPrice };

    const spots = await Spots.findAll({
        where: whereConditions,
        attributes: [
            'id', 'ownerId', 'address', 'city', 'state', 'country', 
            'lat', 'lng', 'name', 'description', 'price', 
            'createdAt', 'updatedAt',
            // [Sequelize.literal('(SELECT AVG("stars") FROM "Reviews" WHERE "Reviews"."spotId" = "Spots"."id")'), 'avgRating'],
            // [fn('AVG', col('Reviews.stars')), 'avgRating']
        ],
        include: [
            {
                model: spotImage, 
                attributes: ['url', 'preview'], 
                required: false
            },
            {
                model: Review,
                attributes: [],
                required: false
            }
        ],
        limit,
        offset,
        group: ['Spots.id']
    });

    const formattedSpots = await Promise.all(spots.map(async (spot) => {
        const spotData = spot.toJSON();
        const previewImageObj = spotData.spotImages?.find(image => image.preview === true) || null;

        const avgRating = await avgRatings(spotData.id);

        return {
            id: spotData.id,
            ownerId: spotData.ownerId,
            address: spotData.address,
            city: spotData.city,
            state: spotData.state,
            country: spotData.country,
            lat: spotData.lat,
            lng: spotData.lng,
            name: spotData.name,
            description: spotData.description,
            price: spotData.price,
            updatedAt: spotData.updatedAt,
            createdAt: spotData.createdAt,
            avgRating: avgRating || 0,
            previewImage: previewImageObj ? previewImageObj.url : null
        };
    }));

    const response = { 
        Spots: formattedSpots,
        page: pageNumber, 
        size: pageSize     
    };
    res.status(200).json(response);
});

//get all Spots owned by the Current User
router.get('/current', requireAuth, async (req, res) => {
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
        },
        attributes: [
            'id', 'ownerId', 'address', 'city', 'state', 'country', 
            'lat', 'lng', 'name', 'description', 'price', 
            'createdAt', 'updatedAt',
        ],
        include: [
            {
                model: spotImage,
                attributes: ['url', 'preview'],
                required: false
            }
        ]
    });

    const formattedSpots = await Promise.all(spots.map(async (spot) => {
        const spotData = spot.toJSON();
        const previewImageObj = spotData.spotImages?.find(image => image.preview === true) || null;

        // Calculate avgRating using avgRatings function
        const avgRating = await avgRatings(spotData.id);

        return {
            id: spotData.id,
            ownerId: spotData.ownerId,
            address: spotData.address,
            city: spotData.city,
            state: spotData.state,
            country: spotData.country,
            lat: spotData.lat,
            lng: spotData.lng,
            name: spotData.name,
            description: spotData.description,
            price: spotData.price,
            createdAt: spotData.createdAt,
            updatedAt: spotData.updatedAt,
            avgRating: avgRating || null,
            previewImage: previewImageObj ? previewImageObj.url : null
        };
    }));

    const response = { Spots: formattedSpots };

    return res.json(response);
});

// Get details of a Spot from an id
router.get('/:spotId', async (req, res, next) => {
    const spotId = req.params.spotId;

    
    const details = await Spots.findByPk(spotId, {
        attributes: [
            'id', 'ownerId', 'address', 'city', 'state', 'country', 
            'lat', 'lng', 'name', 'description', 'price', 
            'createdAt', 'updatedAt',
        ],
        include: [
            {
                model: User,  
                attributes: { exclude: ['createdAt', 'updatedAt', 'username', 'email', 'hashedPassword'] }
            },
            {
                model: spotImage,  
                attributes: { exclude: ['createdAt', 'updatedAt', 'spotId'] }
            }
        ]
    });

    if (!details) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        });
    }

    const spotData = details.toJSON();
    
       // Calculate avgStarRating and numReviews using helper functions
       const avgStarRating = await avgRatings(spotId);
       const numReviews = await reviewCount(spotId);
   
       // Format response
       const formattedResponse = {
           id: spotData.id,
           ownerId: spotData.ownerId,
           address: spotData.address,
           city: spotData.city,
           state: spotData.state,
           country: spotData.country,
           lat: spotData.lat,
           lng: spotData.lng,
           name: spotData.name,
           description: spotData.description,
           price: spotData.price,
           createdAt: spotData.createdAt,
           updatedAt: spotData.updatedAt,
           numReviews: numReviews || 0,
           avgStarRating: parseFloat(avgStarRating) || 0,
           SpotImages: spotData.spotImages || [],
           Owner: {
               id: spotData.User.id,
               firstName: spotData.User.firstName,
               lastName: spotData.User.lastName
           }
       };
   
       res.status(200).json(formattedResponse);
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
        if (lat < -90 || lat > 90 || !lat) err.errors.lat = "Latitude must be within -90 and 90";
        if (lng < -180 || lng > 180 || !lng) err.errors.lng = "Longitude must be within -180 and 180";
        if (!name || name.length > 50) err.errors.name = "Name must be less than 50 characters";
        if (!description) err.errors.description = "Description is required";
        if (!price || price <= 0) err.errors.price = "Price per day must be a positive number";
        return next(err);
    }    
    
        const createSpot = await Spots.create({
            ownerId, address, city, state, country, lat, lng, name, description, price
        });
        res.status(201).json(createSpot);
    
});

//Edit a Spot
router.put('/:spotId', requireAuth, async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const spotId = parseInt(req.params.spotId);
    const userId = req.user.id;

    const updatedSpot = await Spots.findByPk(spotId);
   
    if(!updatedSpot){
        return res.status(404).json({
            "message": "Spot couldn't be found"
          });
    };

    if (userId !== updatedSpot.ownerId) {
        return res.status(403).json({
            "message": "Forbidden"
        });
    }

    if (!address || !city || !state || !country || !lat || !lng || !name || !description || !price) {
        const err = new Error("Bad Request");
        err.status = 400; 
        err.errors = {};
        if (!address) err.errors.address = "Street address is required";
        if (!city) err.errors.city = "City is required";
        if (!state) err.errors.state = "State is required";
        if (!country) err.errors.country = "Country is required";
        if (lat < -90 || lat > 90 || !lat) err.errors.lat = "Latitude must be within -90 and 90";
        if (lng < -180 || lng > 180 || !lng) err.errors.lng = "Longitude must be within -180 and 180";
        if (!name || name.length > 50) err.errors.name = "Name must be less than 50 characters";
        if (!description) err.errors.description = "Description is required";
        if (!price || price <= 0) err.errors.price = "Price per day must be a positive number";
        return next(err);
    } ;

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
    });
    return res.status(200).json(updatedSpot);
});

//Delete a Spot
router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const spotId = parseInt(req.params.spotId);
    const userId = req.user.id;
    const deletedSpot = await Spots.findByPk(spotId);

    if(!deletedSpot){
        return res.status(404).json({
            "message": "Spot couldn't be found"
          })
    }

    if (userId !== deletedSpot.ownerId) {
        return res.status(403).json({
            "message": "Forbidden"
        });
    }

    await deletedSpot.destroy();
    res.status(200).json({
        "message": "Successfully deleted"
      })
})

   
module.exports = router;