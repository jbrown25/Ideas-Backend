const express = require('express');
const router = express.Router();

const {isAuthenticated, isAuthenticatedOrGuest} = require('../services/auth');
const submissionController = require('../controllers/submission_controller');


router.post('/:idea_id', isAuthenticated, submissionController.createSubmission);
router.get('/:idea_id', isAuthenticatedOrGuest, submissionController.getSubmissionsByIdea);
router.get('/tags/:tag', submissionController.getSubmissionsByTag);

module.exports = router;