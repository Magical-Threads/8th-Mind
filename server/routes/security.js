let express = require('express');
let router = express.Router();
let http = require('http');
let path = require('path');
let h = require('../helpers');
let db = require('../db');
let User = require('../models/user');
let bcrypt = require('bcryptjs');
let crypto = require('crypto');
let transport = require('../mailer');

// configuration (should move to ENV or config file)
let storageDir = '/var/www/html/storage/submission/photo/';


router.post('/login', function(req, res, next){
  let params = req.body;
  let email = params.username;
  let password = params.password;
  User.login(email, password).then(async function(user) {
    if (user == null) {
      return res.status(401).json({success: false});
    } else if (user.errors) {
      return res.status(401).json({success: false});
    } else {
      res.status(200).json({
        success: true,
        access_token: user.token,
        userID: user.id,
        userFirstName: user.userFirstName,
        userLastName: user.userLastName
      });
    }
  });
});


router.post('/register', function(req, res, next) {
	let params = req.body;
	req.checkBody('userFirstName', 'FirstName Required').notEmpty();
	req.checkBody('userLastName', 'LastName Required').notEmpty();
	req.checkBody('userEmail', 'Email Required').notEmpty();
	req.checkBody('userPassword', 'Password Required').notEmpty();

  let subscribeCheck = params.subscribeCheck;
  req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {
      return res.status(200).json({success: false, errors: "All fields are required"});
    } else {
      User.register(
        params.userFirstName,
        params.userLastName,
        params.userEmail,
        params.userPassword
      ).then(async function(user) {
        if (!user) {
          console.log('@@@@ Register returned null');
          return res.status(422).json({success: false, errors: "unable to register"});
        } else if (user.errors) {
          console.log('@@@@ Errors registering user ',user.errors);
          return res.status(422).json({success: false, errors: user.errors});
        } else {
          res.render('emails/activation', {
            req: req,
            token: user.emailConfirmationToken,
            firstName: user.userFirstName
          }, function(err ,html) {
            transport.sendMail({
              from: '8th Mind <noreply@8thmind.com>',
              to: user.userEmail,
              subject: 'Welcome to 8th Mind, '+user.userFirstName+'!',
              html: html
            }, function(err, info){
              if (err) {
                console.log('#### Error in sending email!');
                console.log(err);
              } else {
                console.log('@@@@ Mail sent', info);
              }
            });
          });
          if (subscribeCheck) {
            await user.subscribe();
          }
          return res.status(200).json({success: true, data: user.serialized});
          // }).catch(function (err) {
          //   return res.status(500).json({success: false, errors: err});
        }
      });
    }
  });
});

// subscribe //

router.post('/subscribe', function(req, res, next){
	var params = req.body;
	req.checkBody('subscribeEmail', 'subscribeEmail Required').notEmpty().isEmail();

    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
          return res.status(200).json({success: false, errors: "Email is not Valid"});

        }
        else
        {

			   db.query("SELECT * FROM subscribers WHERE subscribeEmail = '"+params.subscribeEmail+"'", function (err, user, fields) {
               if (user.length==1)
                {
                   return res.status(200).json({success: false, errors: "Already Subscribe"});
                }
				else
				{

                   var createdAt = new Date();
                   var ins={
                    subscribeEmail:params.subscribeEmail,
                    createdAt:createdAt,
                   };

					db.query('INSERT INTO subscribers SET ?',ins, function (err, result) {
						if (err) throw err;

						  res.status(200).json({
								success: true,
								error:false
							});

					  });

				}
			   });

      }
  });
});
router.post('/password_hash',function(req, res, next){
	var params = req.body;
	if(params.type=='check')
	{
		bcrypt.compare(params.userPassword, params.hashPassword, function(err, isMatch)
		{
			if(isMatch)
			{
				res.status(200).send(true);
			}
			else
			{
				res.status(200).send(false);
			}
		});
	}
	else if(params.type=='hash')
	{
		bcrypt.genSalt(10,function(err,salt){
		   bcrypt.hash(params.userPassword ,salt, function(err,hash)
		   {
		      res.status(200).send(hash);
		   });
		});

	}
	else
	{
		res.status(200).send(false);
	}



});


module.exports = router;
