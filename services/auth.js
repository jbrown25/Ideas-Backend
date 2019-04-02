const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//this file for creating, verifying and parsing tokens, and auth middleware for protected routes

exports.createUserToken = user => {
	const timestamp = new Date().getTime();
	const userData = {
		sub: user.id,
		username: user.username,
		email: user.email,
		iat: timestamp
	};
	return jwt.sign(userData, process.env.SECRET, {expiresIn: '7d'});
};

//middleware to check if valid token is in the header as "authorization"
//if valid, passes some user data to next middleware in res.locals
exports.isAuthenticated = (req, res, next) => {
	const token = req.header('authorization');
	if(!token) return res.status(401).send({error: 'Token required'});
	const parsedToken = jwt.verify(token, process.env.SECRET);
	
	//check token, make sure not expired (?)
	const userFromToken = {
		id: parsedToken.sub,
		username: parsedToken.username,
		email: parsedToken.email
	};
	res.locals.authenticatedUser = userFromToken;
	next();
};

//some routes don't necessarily require authentication
//Adds user data to res.locals if authenticated, otherwise just passes to next middleware
exports.isAuthenticatedOrGuest = (req, res, next) => {
	const token = req.header('authorization');
	if(!token){
		return next();
	}else{
		try {
			const parsedToken = jwt.verify(token, process.env.SECRET);
			
			//check token, make sure not expired (?)
			const userFromToken = {
				id: parsedToken.sub,
				username: parsedToken.username,
				email: parsedToken.email
			};
			res.locals.authenticatedUser = userFromToken;
			next();
		}catch(error){
			console.log(error);
			next();
		}
	}
};