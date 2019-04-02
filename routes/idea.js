const express = require('express');

const ideaController = require('../controllers/idea_controller');
const {isAuthenticated, isAuthenticatedOrGuest} = require('../services/auth');

const router = express.Router();

router.get('/', isAuthenticatedOrGuest, ideaController.getAllIdeas);
router.post('/', isAuthenticated, ideaController.createIdea);
router.patch('/:idea_id', isAuthenticated, ideaController.updateIdea);
router.delete('/:idea_id', isAuthenticated, ideaController.deleteIdea);
router.get('/:slug', isAuthenticatedOrGuest, ideaController.getIdeaBySlug);
//router.get('/:idea_id', isAuthenticatedOrGuest, ideaController.getIdeaById);
//router.get('/:idea_id', ideaController.getIdeaById);


module.exports = router;