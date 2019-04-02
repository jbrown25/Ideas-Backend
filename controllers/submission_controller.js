const Submission = require('../models/submission');
const User = require('../models/user');
const Idea = require('../models/idea');

const sequelize = require('../config/database');
const Op = require('sequelize').Op;

exports.createSubmission = (req, res, next) => {
	const {authenticatedUser} = res.locals;
	const {idea_id} = req.params;
	const {
		repo_link,
		live_link,
		description,
		tags
	} = req.body;

	if(!repo_link) return res.status(422).send({error: "repo link is required at minimum"});

	//need to pull up user and idea. Not sure about this.
	let foundUser;
	User.findByPk(authenticatedUser.id)
		.then(user => {
			foundUser = user;
			return Idea.findByPk(idea_id);
		})
		.then(idea => {
			return foundUser.createSubmission({
				repo_link,
				live_link,
				description,
				tags,
				username: foundUser.username,
				idea_title: idea.title,
				ideaId: idea_id
			});
		})
		.then(submission => {
			res.status(201).send(submission);
		})
		.catch(err => {
			console.log(err);
			res.status(400).send(err);
		});
};

//gonna want to know if user signed in, whether it belongs to user
exports.getSubmissionsByIdea = (req, res, next) => {
	const {idea_id} = req.params;
	const {authenticatedUser} = res.locals;

	Submission.findAll({where: {ideaId: idea_id}})
		.then(submissions => {
			return res.status(200).send(submissions.map(sub => {
				const owned_by_user = authenticatedUser ? authenticatedUser.id === sub.userId : false;
				return {
					id: sub.id,
					repo_link: sub.repo_link,
					live_link: sub.live_link,
					description: sub.description,
					tags: sub.tags,
					username: sub.username,
					owned_by_user
				};
			}));
		})
		.catch(err => {
			console.log(err);
			return res.status(400).send(err);
		});
};

exports.getSubmissionsByUser = (req, res, next) => {
	const {user_id} = req.params;

	Submission.findAll({where: {userId: user_id}})
		.then(submissions => {
			console.log(submissions);
			res.status(200).send(submissions);
		})
		.catch(err => {
			console.log(err);
			res.status(401).send(err);
		});
};

exports.getSubmissionsByTag = (req, res, next) => {
	const {tag} = req.params;
	sequelize.query(
		`SELECT *
		FROM submissions
		WHERE JSON_SEARCH(tags, "all", "${tag}") IS NOT NULL`
	)
		.then( ([results, metadata]) => {
			console.log(results);
			return res.status(200).send(results);
		})
		.catch(err => {
			console.log(err);
			return res.status(400).send(err);
		});
};