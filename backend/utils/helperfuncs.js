const { where } = require("sequelize");
const {spot,review} = require('../db/models')

//Stars Average 
const avgRatings = async (spotId) => {
    const reviews = await review.findAll({
        where: { spotId },
        attributes: ['stars']
    });

    const total = reviews.reduce((sum, review) => sum + review.stars, 0);
    if (! review.stars){
        return 0; // It dosent have star rating
    }

    const ratings = reviews.length;
    if (!ratings) {
        return 0; // It dosent have review
    }

    const avgRatings = total / ratings;
    return avgRatings;
};

// Review Count
const reviewCount = async(spotId) => {
    const reviewCount = await review.count({
        where: {spotId}
    });
    return reviewCount
}

module.exports = Router;