var mysql = require('mysql');

// var con = mysql.createConnection({
//   host: "mysql",
//   user: "root",
//   password: "Robbio123",
//   database: "content_portal"

// console.log('@@@@ prod server ',process.env.DB_HOST,process.env.DB_USERNAME,process.env.DB_DATABASE);

var con = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE
});

module.exports = con;
