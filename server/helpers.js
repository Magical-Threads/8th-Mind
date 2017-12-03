const jwt = require('jsonwebtoken');

exports.tokenDecode = function(req, res, next){
  var token = req.headers['authorization'];
  var newtok=token && token.replace('Bearer ', '') ;
  if (newtok != null) {
    jwt.verify(newtok, 'secret', function(err, decoded) {
      if (err) {
        req.user='';
        next();
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
      req.user='';
      next();
  }
};


exports.optionLogin = function(req, res, next){
	var token = req.headers['authorization'];
  if(!token) {
    req.user='';
    next();
	} else {
    var newtok=token && token.replace('Bearer ', '') ;
		if (newtok) {
			jwt.verify(newtok, 'secret', function (err, decoded) {
				if (err) {
					req.user = '';
					next();
				} else {
					req.user = decoded;
					next();
				}
			});
		} else {
			req.user = '';
			next();
		}
	}
};

exports.ensureLogin = function(req, res, next){
  var token = req.headers['authorization'];
  var newtok=token && token.replace('Bearer ', '') ;
  if (newtok) {
    jwt.verify(newtok, 'secret', function(err, decoded) {
      if (err) {
        return res.status(401).json({success:false,error: 'Failed to authenticate token.',authErr:true});
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    return res.status(401).json({success:false,error: 'Failed to authenticate token.',authErr:true});
  }
};
