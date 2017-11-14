var mysql = require('mysql');
var env = process.env.NODE_ENV || 'prod';

var con = require('./db-'+env);

con.connect(function(err) {
  if (err) throw err;
  console.log("--- Database Connected ---");
});

module.exports = con;
