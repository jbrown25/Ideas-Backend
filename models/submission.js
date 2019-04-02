const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Submission = sequelize.define('submission', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	repo_link: {
		type: Sequelize.STRING,
		allowNull: false
	},
	live_link: Sequelize.STRING,
	description: Sequelize.STRING(500),
	tags: Sequelize.JSON,
	idea_title: Sequelize.STRING,
	username: Sequelize.STRING //will also have user id, but want to be able to pull this up by only looking at this table
});

module.exports = Submission;