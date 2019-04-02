const User = require('../models/user');
const bcrypt = require('bcrypt');
const Idea = require('../models/idea');
const Submission = require('../models/submission');
// const Rating = require('../models/rating');

const users = [
	{
		username: "justin",
		email: "fake@email.com",
		password: bcrypt.hashSync("password", 10)
	},
	{
		username: "justin2",
		email: "fake2@email.com",
		password: bcrypt.hashSync("password", 10)
	},{
		username: "justin3",
		email: "fak3e@email.com",
		password: bcrypt.hashSync("password", 10)
	},{
		username: "justin4",
		email: "fake4@email.com",
		password: bcrypt.hashSync("password", 10)
	},
];

const ideas = [
	{
		title: "Todo app",
		description: "Description of a todo app",
		short_description: "A checklist app.",
		difficulty: "easy",
		slug: "todo_app",
		userId: 1
	},
	{
		title: "calculator",
		description: "it calculates numbers.",
		short_description: "calculator.",
		difficulty: "easy",
		slug: "calculator",
		userId: 1
	}
];

const submissions = [
	{
		repo_link: 'https://github.com',
		description: 'fake todo app',
		ideaId: 1,
		userId: 1,
		username: 'justin',
		idea_title: 'Todo app',
		tags: ['frontend', 'backend']
	},
	{
		repo_link: 'https://github.com',
		description: 'fake calculator app',
		ideaId: 2,
		userId: 1,
		username: 'justin',
		idea_title: 'calculator',
		tags: ['react', 'backend']
	}
];

exports.seedData = () => {
	User.bulkCreate(users)
		.then(result => {
			return Idea.bulkCreate(ideas);
		})
		.then(result => {
			return Submission.bulkCreate(submissions);
		})
		.then(result => console.log(result))
		.catch(err => console.log(err));
};