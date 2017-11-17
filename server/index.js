let express = require('express');
let logger = require('morgan');
let bodyParser = require('body-parser');
let cors = require('cors');
let expressValidator = require('express-validator');
let path = require('path');

let app = express();
let port = process.env.NODE_ENV == 'test' ? '3001' : '3000';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(function(req, res, next) {
//   // Log all requests
//   console.log('@@@@ Request body: ',req.body);
//   next();
// });
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// shared storage folder from other containers
app.use('/storage', express.static('/var/www/html/storage'));
app.use('/test', express.static(path.join(__dirname, 'test')));

// request that pings the server.  Used in tests, and can be used for
// alive testing.
app.get('/ping', function(req, res) {
  // console.log('@@@@ Ping request');
  res.status(200).json({
    success: true,
  });
});

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    let namespace = param.split('.')
      , root      = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(require('./routes/security'));
app.use(require('./routes/users'));
app.use(require('./routes/articles'));

let server = app.listen(port,function() {
    console.log('--- Server starts at port '+port+' ---');
});

// expose app
exports = module.exports = {app: app, server: server};
