var jwt = require('jsonwebtoken');

exports.tokenDecode = function(req, res, next){
    var token = req.headers['access_token'];

    if (token != null) {
        jwt.verify(token, 'secret', function(err, decoded) {
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

	// need error handling for when header is missing

    if(!token) {
	    req.user='';
	    next();
	}
	else {

		var newtok = token.replace('Bearer ', '');

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

	// need error handling for when header is missing

    var newtok=token && token.replace('Bearer ', '') ;

    if (newtok) {
        jwt.verify(newtok, 'secret', function(err, decoded) {
            if (err) {
                return res.status(200).json({success:false,error: 'Failed to authenticate token.',authErr:true});
            } else {
                req.user = decoded;
                next();
            }
        });

    } else {
        return res.status(200).json({success:false,error: 'Failed to authenticate token.',authErr:true});

    }
};
