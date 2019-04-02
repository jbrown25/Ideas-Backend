const express = require('express');
const {isAuthenticated} = require('../services/auth');

const router = express.Router();

const ratingController = require('../controllers/rating_controller');

router.post('/:idea_id', isAuthenticated, ratingController.setRating);
router.get('/:idea_id', ratingController.getRating);
router.get('/:idea_id/user_rating', isAuthenticated, ratingController.getUserRating);

module.exports = router;