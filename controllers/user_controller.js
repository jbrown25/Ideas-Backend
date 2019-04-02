//will be for retrieving user data (bio, avatar, social links) and updating authed user's own data
const User = require('../models/user');
const jwt = require('jsonwebtoken');

//only need this for getting bio, avatar, etc
exports.getUserData = (req, res, next) => {
	//should def have user in res.locals
	const {authenticatedUser} = res.locals;
	//right now I'm sending all the data (id, username, email) thru jwt, but in future will have bio, avatar, links
	//that I won't send this way
	User.findOne({where: {id: authenticatedUser.id}})
		.then(foundUser => {
			if(!foundUser) throw {error: 'user not found somehow.'};
			
			//should return new object without timestamps, hash
			//return user data pulled from db
			return res.status(200).send({
				user: {
					username: foundUser.username,
					email: foundUser.email,
					bio: foundUser.bio,
					avatar: foundUser.avatar
				}
			});
		})
		.catch(err => {
			console.log(err);
			res.status(401).send(err);
		});
};

exports.getUserById = (req, res, next) => {
	const {user_id} = req.params;
	if(!user_id){
		console.log('no user_id found!');
		return res.status(422).send({error: 'No user id found'});
	}
	User.findOne({where: {id: user_id}})
		.then(user => {
			if(!user) throw {error: 'No user has this id'};
			return res.status(200).send({
				id: user.id,
				username: user.username,
				bio: user.bio,
				avatar: user.avatar
			});
		})
		.catch(err => {
			console.log(err);
			return res.status(401).send(err);
		});
};

//for now, just allow updates to bio
exports.updateUserData = (req, res, next) => {
	const {authenticatedUser} = res.locals;
	const {bio} = req.body;
	
	//
	const newUserData = {};
	if(bio !== undefined){
		if(bio.length <= 2000){
			newUserData.bio = bio;
		}else{
			return res.status(422).send({error: 'Bio must be under 2000 chars'});
		}
	}

	User.update(newUserData, {where: {id: authenticatedUser.id}})
		.then(result => {
			console.log(result);
			return res.status(200).send(result);
		})
		.catch(err => {
			console.log(err);
			return res.status(401).send(err);
		});
};