let express = require('express');
let router = express.Router();
let http = require('http');
let path = require('path');
let h = require('../helpers');
let db = require('../db');
let User = require('../models/user');

// configuration (should move to ENV or config file)
let storageDir = '/var/www/html/storage/submission/photo/';


router.post('/login', function(req, res, next){
  let params = req.body;
  let email = params.username;
  let password = params.password;
  let user = User.login(email, password);
  if (user == null) {
    return res.status(422).json({success: false, errors: "No user exist with this Email: "+params.username});
  } else if (user.errors) {
    return res.status(422).json({success: false, errors: user.errors});
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


router.post('/register', function(req, res, next){
	var params = req.body;
	req.checkBody('userFirstName', 'FirstName Required').notEmpty();
	req.checkBody('userLastName', 'LastName Required').notEmpty();
	req.checkBody('userEmail', 'Email Required').notEmpty();
	req.checkBody('userPassword', 'Password Required').notEmpty();



   var subscribeCheck=params.subscribeCheck;
    req.getValidationResult().then(function(result) {
        if (!result.isEmpty()) {
          return res.status(200).json({success: false, errors: "All fields are required"});

        }
        else
        {

        bcrypt.genSalt(10,function(err,salt){
		   bcrypt.hash(params.userPassword ,salt, function(err,hash)
		   {

			   db.query("SELECT * FROM users WHERE userEmail = '"+params.userEmail+"'", function (err, user, fields) {
               if (user.length==1)
                {
                   return res.status(200).json({success: false, errors: "A user with that email address already exists"});
                }
				else
				{

                   var emailConfirmationToken = crypto.randomBytes(40).toString('hex');
                   var emailStatus='Unverified';
                   var userStatus='Pending';
                   var createdAt = new Date();
                   var updatedAt = new Date();

                   var ins_user={
                    userFirstName:params.userFirstName,
                    userLastName:params.userLastName,
                    userEmail:params.userEmail,
                    userPassword:hash,
                    emailConfirmationToken:emailConfirmationToken,
					passwordResetToken:'',
					userRole:3,
                    emailStatus:emailStatus,
                    userStatus:userStatus,
                    createdAt:createdAt,
                    updatedAt:updatedAt,
					lastLogin:createdAt
                   };



					db.query('INSERT INTO users SET ?',ins_user, function (err, result) {
						if (err) throw err;
					  var user = {
							userID: result.insertId,
							userFirstName:params.userFirstName,
							userLastName:params.userLastName,
							userEmail: params.userEmail,
                            userStatus:userStatus,
                            emailStatus:emailStatus,
                            userRole:3
							};

                        // send email activation //

						res.render('emails/activation', {req: req, token: emailConfirmationToken, firstName: user.userFirstName }, function(err ,html){

							transport.sendMail({
								from: '8th Mind <postmaster@mg.8thmind.com>',
								to: user.userEmail,
								subject: 'Welcome to 8th Mind, '+user.userFirstName+'!',
								html: html
							}, function(err){
								console.log(err);
							});
						});

                         if(subscribeCheck == 'true')
                         {

                               db.query("SELECT * FROM subscribers WHERE subscribeEmail = '"+params.userEmail+"'", function (err, suser) {
                                   if (suser.length==0)
                                    {
                                       var ins={
                                        subscribeEmail:params.userEmail,
                                        createdAt:createdAt,
                                       };
                					 db.query('INSERT INTO subscribers SET ?',ins, function (err, result) { });
                				   }
                			   });

                        }

						  res.status(200).json({
								success: true,
								data: user,
							});

					  });

				}

			    });


		   });
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
