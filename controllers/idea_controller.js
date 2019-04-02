const Idea = require('../models/idea');
const User = require('../models/user');
const slugify = require('slugify');

exports.createIdea = (req, res, next) => {
	const {authenticatedUser} = res.locals;
	const {title, description, short_description, difficulty} = req.body;
	if(!title || !description || !short_description){
		return res.status(422).send({error: 'Both title and description are required'});
	}

	if(description.length > 1000){
		return res.status(422).send({error: 'Description must be 1000 characters or under'});
	}

	if(short_description.length > 300){
		return res.status(422).send({error: 'Short description must be 300 characters or under'});
	}

	Idea.findOne({where: {title: title}})
		.then(idea => {
			if(idea) throw {error: 'Title must be unique'};
			return User.findByPk(authenticatedUser.id);
		})
		.then(user => {
			//create the slug
			const slug = slugify(title, {
				replacement: '_',
				remove: null,
				lower: true
			});

			return user.createIdea({
				title,
				slug,
				description,
				short_description,
				difficulty
			});
		})
		.then(idea => {
			console.log(idea);
			return res.status(201).send(idea);
		})
		.catch(err => {
			console.log(err);
			res.status(401).send(err);
		});
};

exports.updateIdea = (req, res, next) => {
	const {authenticatedUser} = res.locals;
	const {title, description, difficulty, short_description} = req.body;
	const {idea_id} = req.params;
	
	const newIdeaData = {};
	
	//check if fields were in body, add to new idea obj if they pass validation
	if(title !== undefined){ //checking for undefined to allow empty string. My revisit this, shouldn't allow blank title or description
		if(title.length <= 255){
			newIdeaData.title = title;
		}else{
			return res.status(422).send({error: 'Title must be under 255 chars'});
		}
	}
	if(description !== undefined){
		if(description.length <= 1000){
			newIdeaData.description = description;
		}else{
			return res.status(422).send({error: 'Description must be under 1000 chars'});
		}
	}
	if(short_description !== undefined){
		if(short_description.length <= 300){
			newIdeaData.short_description = short_description;
		}else{
			return res.status(422).send({error: 'Short description must be under 300 chars'});
		}
	}

	if(difficulty !== undefined){
		newIdeaData.difficulty = difficulty;
	}

	Idea.findByPk(idea_id)
		.then(idea => {
			if(idea.userId !== authenticatedUser.id) throw {error: 'Idea must belong to signed in user'};
			return idea.update(newIdeaData);
		})
		.then(idea => {
			return res.status(200).send({
				id: idea.id,
				title: idea.title,
				slug: idea.slug,
				description: idea.description,
				short_description: idea.short_description,
				rating: idea.rating,
				difficulty: idea.difficulty,
				userId: idea.userId
			});
		})
		.catch(err => {
			console.log(err);
			res.status(401).send(err);
		});
};

//should return idea, and whether it belongs to authenticated user
exports.getIdeaById = (req, res, next) => {
	const {authenticatedUser} = res.locals;
	const {idea_id} = req.params;

	//Guest, so definitely not owned by user
	Idea.findByPk(idea_id)
		.then(idea => {
			if(!idea){
				return res.status(204).send(null);
			}else{
				const owned_by_user = authenticatedUser && authenticatedUser.id === idea.user_id;
				return res.status(200).send({
					idea: idea.id,
					title: idea.title,
					slug: idea.slug,
					description: idea.description,
					short_description: idea.short_description,
					rating: idea.rating,
					difficulty: idea.difficulty,
					owned_by_user
				});
			}
		})
		.catch(err => {
			console.log(err);
			return res.status(401).send(err);
		});
};

//this will need to be extended for sorting.
//for now, return all then sort in the frontend
exports.getAllIdeas = (req, res, next) => {
	const {authenticatedUser} = res.locals;

	Idea.findAll()
		.then(ideas => {
			return res.status(200).send(ideas.map(idea => {
				const owned_by_user = authenticatedUser ? authenticatedUser.id === idea.userId : false;
				return {
					id: idea.id,
					title: idea.title,
					slug: idea.slug,
					short_description: idea.short_description, //only return short description
					rating: idea.rating,
					difficulty: idea.difficulty,
					owned_by_user
				};
			}));
		})
		.catch(err => {
			console.log(err);
			return res.status(400).send(err);
		});
};

exports.getIdeaBySlug = (req, res, next) => {
	const slug = req.params.slug.toLowerCase();
	const {authenticatedUser} = res.locals;

	Idea.findOne({where: {slug: slug}})
		.then(idea => {
			if(!idea){
				return res.status(204).send(null);
			}else{
				const owned_by_user = authenticatedUser ? authenticatedUser.id === idea.userId : false;
				return res.status(200).send({
					id: idea.id,
					title: idea.title,
					slug: idea.slug,
					description: idea.description,
					short_description: idea.short_description,
					rating: idea.rating,
					difficulty: idea.difficulty,
					owned_by_user
				});
			}
		})
		.catch(err => {
			console.log(err);
			return res.status(400).send(err);
		});
};

exports.deleteIdea = (req, res, next) => {
	const {authenticatedUser} = res.locals;
	const {idea_id} = req.params;
	Idea.findByPk(idea_id)
		.then(idea => {
			if(idea.userId !== authenticatedUser.id) throw {error: 'Idea must belong to signed in user'};
			return idea.destroy();
		})
		.then(result => {
			console.log(result);
			res.status(200).send(result);
		})
		.catch(err => {
			console.log(err);
			res.status(401).send(err);
		});
};