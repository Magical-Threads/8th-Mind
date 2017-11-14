var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Robbio123",
  database: "content_portal"
});

module.exports = con;
