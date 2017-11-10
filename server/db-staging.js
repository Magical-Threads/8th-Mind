var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Robbio123",
  database: "content_portal"
});


con.connect(function(err) {
  if (err) throw err;
  console.log("--- Database Connected ---");
});

module.exports = con;