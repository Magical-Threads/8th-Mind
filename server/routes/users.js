var express = require('express');
var bcrypt = require('bcryptjs');
var router = express.Router();
var h = require('../helpers');
var db = require('../db');
var crypto = require('crypto');
var transport = require('../mailer');
let User = require('../models/user');

router.post('/users/change-password/',h.ensureLogin, function(req, res, next) {
  var params = req.body;
	req.checkBody('oldPassword', 'FirstName Required').notEmpty();
	req.checkBody('newPassword', 'LastName Required').notEmpty();
	req.checkBody('newPasswordConfirmation', 'Email Required').notEmpty();

  req.getValidationResult().then(function(result) {
    if (!result.isEmpty()) {
      return res.status(200).json({success: false, errors: "All fields are required"});
    } else {
      var userID = req.user.userID;
      var updatedAt = new Date();
      db.query("SELECT * FROM users WHERE userID = '"+userID+"'", function (err, user) {
        bcrypt.compare(params.oldPassword, user[0].userPassword, function(err, isMatch) {
          if(isMatch) {
            bcrypt.genSalt(10,function(err,salt) {
              bcrypt.hash(params.newPassword ,salt, function(err,hash) {
                var sql = "UPDATE users set userPassword =?,updatedAt=? WHERE userID = ?";
                db.query(sql,[hash,updatedAt,userID], function (err, user) {
                  res.status(200).json({
                    success: true,
                    error:false
                  });
                });
              });
           	});
          } else {
            return res.status(200).json({success: false, errors: "Old Password is Wrong"});
          }
        });
      });
    }
  });
});

router.get('/users/activate/', function(req, res, next) {
    var token = req.query.token;
    if (!token) {
      res.status(200).json({
        success: false,
        errors:'Token is Missing.'
      });
    } else {
      User.validate_email(token).then((u) => {
        if (!u) {
          return res.status(200).json({success: false, errors: "Token is expired."});
        } else {
          res.status(200).json({
            success: true
          });
        }
      });
    }
});

router.post('/users/forget-password/', function(req, res, next){
   var params = req.body;
    if(params.email=='')
    {
         res.status(200).json({
                                success: false,
                                error:' Email is Missing'
                             });
    }
    else
    {
        db.query("SELECT * FROM users WHERE userEmail = '"+params.email+"'", function (err, user) {

                   if (user.length==0)
                    {
                       return res.status(200).json({success: false, errors: "No user exist with this Email"});
                    }
                    else
                    {
                         var userID=user[0].userID;
                         var passwordResetToken = crypto.randomBytes(40).toString('hex');
                         var sql = "UPDATE users set passwordResetToken=?  WHERE userID = ?";
                         db.query(sql,[passwordResetToken,userID], function (err, user) {

                                        res.render('emails/password-reset', {req: req, token:passwordResetToken}, function(err ,html){
                                                transport.sendMail({
                                                    from: '8th Mind <postmaster@mg.8thmind.com>',
                                                    to: params.email,
                                                    subject: '8th Mind - Reset Password',
                                                    html: html
                                                }, function(err){
                                                });
                                            });


                                             res.status(200).json({
                                                success: true,
                                                error:false



                                             });
                                  });

                    }


              });
    }

});
router.post('/users/reset-password-process/', function(req, res, next){
    var params = req.body;
    var token = params.token;
    if(!token)
    {
         res.status(200).json({
                                success: false,
                                error:' Token is Missing'
                             });
    }
    else if(params.newPassword=='')
    {
         res.status(200).json({
                                success: false,
                                error:' New password is Missing'
                             });
    }
    else
    {
        db.query("SELECT * FROM users WHERE passwordResetToken = '"+token+"'", function (err, user, fields) {

                 if (user.length==0)
                    {
                       return res.status(200).json({success: false, errors: "Token is expired please reset email again."});
                    }
                    else
                    {
                         var userID=user[0].userID;
                         var updatedAt = new Date();
                                    bcrypt.genSalt(10,function(err,salt){
                                		  bcrypt.hash(params.newPassword ,salt, function(err,hash)
                                		   {
                                		     var sql = "UPDATE users set userPassword =? ,passwordResetToken=?,updatedAt=? WHERE userID = ?";
                                                db.query(sql,[hash,"",updatedAt,userID], function (err, user) {

                                                                 res.status(200).json({
                                                                    success: true,
                                                                    error:false
                                                                 });
                                                      });




                                              });
            	                           	});


                    }

              });
    }

});
router.get('/users/:id', h.ensureLogin, function(req, res){
    var userID=req.user.userID;
     db.query("SELECT * FROM users WHERE userID = '"+userID+"'", function (err, user, fields) {
                user = {
                userID: user[0].userID,
                userFirstName:user[0].userFirstName,
				userLastName:user[0].userLastName,
                userEmail: user[0].userEmail,
                };

                res.status(200).json({
                                success: true,
                                error:false,
                                data: user,
                             });

              });

});
module.exports = router;
