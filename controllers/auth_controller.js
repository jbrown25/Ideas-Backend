const User = require('../models/user');
const Op = require('sequelize').Op;
const bcrypt = require('bcrypt');
const {createUserToken} = require('../services/auth');

exports.signup = (req, res, next) => {
	const {
		email,
		username,
		password
	} = req.body;
	if(!email || !username || !password){
		return res.status(422).send({error: 'You must enter email, username, and password'});
	}
	//put your password and username requirements here
	if(password.length < 6) return res.status(422).send({error: 'Password must be at least 6 characters'});

	User.findOne({
		where: {
			[Op.or]: [{email: email}, {username: username}]
		}
	})
		.then(existingUser => {
			if(existingUser){
				//existing user data to lower case
				const userEmail = existingUser.email.toLowerCase();
				const userUsername = existingUser.username.toLowerCase();

				//both already exist
				if(
					userEmail === email.toLowerCase() &&
					userUsername === username.toLowerCase()
				) throw {error: 'Email and username already in use'};
				
				//email already exists
				if(userEmail === email.toLowerCase()) throw {error: 'Email already in use'};
				
				//username already exists
				throw {error: 'Username already in use'};
			}
			return bcrypt.hash(password, 10);
		})
		.then(hash => {
			return User.create({
				username,
				email,
				password: hash
			});
		})
		.then(newUser => {
			const token = createUserToken(newUser);
			return res.status(201).send({
				token,
				user: {
					username: newUser.username,
					email: newUser.email,
					bio: newUser.bio,
					avatar: newUser.avatar
				}
			});
		})
		.catch(err => {
			console.log(err);
			res.status(422).send(err);
		});
};

exports.signin = (req, res, next) => {
	const {username, password} = req.body;
	if(!username || !password) return res.status(422).send({error: 'Username and password are required'});

	let foundUser;
	User.findOne({where: {username: username}})
		.then(user => {
			if(!user) throw {error: 'Username not found in our records'};
			foundUser = user;
			return bcrypt.compare(password, foundUser.password);
		})
		.then(passed => {
			if(!passed) throw {error: 'Password is incorrect'};
			const token = createUserToken(foundUser);
			return res.status(200).send({
				token,
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