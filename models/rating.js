const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Rating = sequelize.define('rating', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	value: {
		type: Sequelize.INTEGER,
		allowNull: false
	}
});

module.exports = Rating;