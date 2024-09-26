// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const spotImagesRouter = require('./spotImages.js');
const { restoreUser } = require("../../utils/auth.js");
const reviewRouter = require('./review.js');
const spotsIdReviewsRouter = require('./review.js')
const spotImageRouter = require('./spotImages.js')
const reviewImageRouter = require('./reviewImages.js')


// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/session', sessionRouter);
router.use('/spots', spotsRouter);
router.use('/users', usersRouter);
router.use('/spots', spotImagesRouter)
router.use('/reviews', reviewRouter);
router.use('/spots', spotsIdReviewsRouter)
router.use('/spot-images', spotImageRouter)
router.use('/review-images', reviewImageRouter)


router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;