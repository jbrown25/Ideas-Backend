const Rating = require('../models/rating');
const Idea = require('../models/idea');

//user auth'd, localhost:8080/rating/:idea_id
//setting a new rating creates a new average rating. Not sure how this scales.
//setting rating also returns 
exports.setRating = (req, res, next) => {
	const {authenticatedUser} = res.locals;
	const {ratingValue} = req.body;
	const {idea_id} = req.params;

	if(ratingValue < 1 || ratingValue > 5) return res.status(422).send({error: 'Rating must be 1 - 5 stars'});

	let newRating;

	//first, check if user has already rated
	Rating.findOne({where: {userId: authenticatedUser.id, ideaId: idea_id}})
		.then(rating => {
			if(rating){
				throw {error: 'user has already rated this idea'};
			}
			
			//log the rating, with reference to user id and idea id
			return Rating.create({
				value: ratingValue,
				userId: authenticatedUser.id,
				ideaId: idea_id
			});
		})
		.then(result => {
			//get all ratings of this idea
			return Rating.findAll({where: {ideaId: idea_id}});
		})
		.then(ratings => {
			//get the new rating
			const N = ratings.length;
			newRating = ratings.map(rating => rating.value).reduce((acc, curr) => acc + curr) / N;
			
			//get idea model
			return Idea.findOne({where: {id: idea_id}});
		})
		.then(idea => {
			//update with new rating
			return idea.update({
				rating: newRating
			});
		})
		.then(idea => {
			return res.status(201).send(idea);
		})
		.catch(err => {
			console.log(err);
			return res.status(401).send(err);
		});
};

//pull the rating off the Idea class
exports.getRating = (req, res, next) => {
	const {idea_id} = req.params;
	Idea.findOne({where: {id: idea_id}})
		.then(idea => {
			return res.status(200).send({rating: idea.rating});
		})
		.catch(err => {
			console.log(err);
			return res.status(400).send(err);
		});
};

//get the rating for this idea by current user
exports.getUserRating = (req, res, next) => {
	const {authenticatedUser} = res.locals;
	const {idea_id} = req.params;

	if(!authenticatedUser) return res.status(401).send({error: 'no user logged in'});

	Rating.findOne({where: {userId: authenticatedUser.id, ideaId: idea_id}})
		.then(rating => {
			return res.status(200).send({rating: value.rating});
		})
		.catch(err => {
			console.log(err);
			return res.status(401).send(err);
		});
};