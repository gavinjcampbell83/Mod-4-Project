const { Review } = require('../db/models'); 


const avgRatings = async (spotId) => {
    const reviews = await Review.findAll({
        where: { spotId },
        attributes: ['stars']
    });

    const total = reviews.reduce((sum, review) => sum + review.stars, 0);
    if (!reviews.length) {
        return 0; 
    }

    const avgRatings = total / reviews.length;
    return avgRatings;
};


const reviewCount = async (spotId) => {
    const reviewCount = await Review.count({
        where: { spotId }
    });
    return reviewCount;
};


module.exports = {
    avgRatings,
    reviewCount
};