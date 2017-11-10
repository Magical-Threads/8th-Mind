var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var jwt = require('jsonwebtoken');
var db = require('./db');
var expressValidator = require('express-validator');
var bcrypt = require('bcryptjs');
var crypto = require('crypto');
var path = require('path');
var transport = require('./mailer');

var app = express();
var port = '3000';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// shared storage folder from other containers
app.use('/storage', express.static('/var/www/html/storage'));
app.use('/test', express.static(path.join(__dirname, 'test')));


app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
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

app.post('/login', function(req, res, next){
    var params = req.body;
    
     db.query("SELECT * FROM users WHERE userEmail = '"+params.username+"'", function (err, user, fields) {
               if (user.length==0) 
                {
                   return res.status(422).json({success: false, errors: "No user exist with this Email: "+params.username});
                }

                bcrypt.compare(params.password, user[0].userPassword, function(err, isMatch) {
                    if(isMatch)
                    {
                       
                       if(user[0].emailStatus=='Unverified')
                       {
                         return res.status(422).json({success: false, errors: "Email is not Verified"});
                       }
                       else if(user[0].userStatus !='Active' )
                       {
                         return res.status(422).json({success: false, errors: "Account Inactive, Please Contact Administrator."});
                       }
                       else if(user[0].userRole !=3)
                       {
                         return res.status(422).json({success: false, errors: "Access Denied"});
                       }
                       else
                       {
                            var lastLogin = new Date();
							var userID=user[0].userID;
                            user_tok = {
                            userID: user[0].userID,                            
							userEmail: user[0].userEmail
                                
                            };
                            var token = jwt.sign(user_tok, 'secret');
                            
                            var sql = "UPDATE users set lastLogin=? WHERE userID = ?";       
                            db.query(sql,[lastLogin,userID], function (err, user) { 
                              
                            }); 
                            
                             res.status(200).json({
                                    success: true,
                                    access_token: token,
                                    userID: userID,                                
                                    userFirstName: user[0].userFirstName,  
                                    userLastName: user[0].userLastName
                                });
                           
                       }     
                    }
                    else
                    {
                        return res.status(422).json({success: false, errors: "Wrong Password"});
                    }
                    
                   
                });
                
               
              });
    
});


app.post('/register', function(req, res, next){
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

app.post('/subscribe', function(req, res, next){
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
app.post('/password_hash',function(req, res, next){
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

app.use(require('./routes/users'));
app.use(require('./routes/articles'));

app.listen(port,function(){
    
    console.log('--- Server starts at port '+port+' ---');
});

// expose app
exports = module.exports = app;