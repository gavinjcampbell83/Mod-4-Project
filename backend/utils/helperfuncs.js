const { Review } = require('../db/models'); // Adjust the path as needed to where your Sequelize models are located

// Stars Average
const avgRatings = async (spotId) => {
    const reviews = await Review.findAll({
        where: { spotId },
        attributes: ['stars']
    });

    const total = reviews.reduce((sum, review) => sum + review.stars, 0);
    if (!reviews.length) {
        return 0; // It doesn't have any reviews
    }

    const avgRatings = total / reviews.length;
    return avgRatings;
};

// Review Count
const reviewCount = async (spotId) => {
    const reviewCount = await Review.count({
        where: { spotId }
    });
    return reviewCount;
};

// Export the functions
module.exports = {
    avgRatings,
    reviewCount
};