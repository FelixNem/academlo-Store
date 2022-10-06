const dotEnv = require('dotenv');
const { Sequelize, DataTypes } = require('sequelize');

dotEnv.config({ path: './config.env' });

const db = new Sequelize({
	dialect: 'postgres',
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	database: process.env.DB,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	logging: false,
});

module.exports = { db, DataTypes };
