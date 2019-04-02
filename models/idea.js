const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Idea = sequelize.define('idea', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	title: Sequelize.STRING,
	slug: Sequelize.STRING,
	short_description: Sequelize.STRING(300),
	description: Sequelize.STRING(1000),
	difficulty: Sequelize.STRING,
	rating: Sequelize.FLOAT
});

module.exports = Idea;