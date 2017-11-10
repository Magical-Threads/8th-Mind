var express = require('express');
var router = express.Router();
var h = require('../helpers');
var db = require('../db');
var http = require('http');
var fs = require('fs-extra');
var formidable = require('formidable');
var path = require('path');

// configuration (should move to ENV or config file)
var storageDir = '/var/www/html/storage/submission/photo/';


/**
 * Primary articles index for home page
 *
 * @param {int} per_page - number of articles to show on a page
 * @param {int} page - which page of content to show
 */
router.get('/articles', function(req, res){
	var page = req.query.page;
	var per_page=req.query.per_page;
	if(!page){ page=1; }
	if(!per_page){ per_page=10; }

	var offset = (page - 1) * per_page;
	var pagination=[];

	db.query("	SELECT count(*) as total" +
		"		FROM articles " +
		"		WHERE articles.articleStatus='Active'", function (err, all) {

		// todo: determine if we still need a left join here (will there ever be orphan articles with no userID?) -RJD

		db.query("	SELECT articles.articleID, articles.articleTitle, articles.articleDescription," +
			"		 articles.articleImage, articles.articleTags, users.userFirstName, users.userLastName," +
			"		 articles.articleStartDate " +
			"		FROM articles " +
			"		LEFT JOIN users on articles.userID=users.userID " +
			"		WHERE articles.articleStatus='Active' " +
			"		ORDER BY articleStartDate DESC " +
			"		LIMIT "+offset+","+per_page, function (err, result) {

			var total_pages=Math.ceil(all[0]['total'] /per_page);

			pagination[0] = {
				'page': page,
				'per_page': per_page,
				'total_pages': total_pages,
				'total': all[0]['total']
			};

			res.status(200).json({result,pagination});

		});
	});
});


router.post('/articles/submission_like/:id',h.ensureLogin, function(req, res){ 
    var userID=req.user.userID;   
    var submissionID=req.params.id;
    var params = req.body;
    var createdAt = new Date();
    var articleID=params.articleID;
    
    
    if(articleID>0)
    {
         db.query(" SELECT * " +
             "      FROM articles " +
             "      WHERE articles.articleStatus='Active' " +
             "       and articleID='"+articleID+"'"+
             "      LIMIT 1", function (err, result) {
                        
                       if(result.length >0)
                       {
                            if(result[0]['articleAllowUpvoting']!='Yes')
                            {
                                return res.status(200).json({success: false, errors: "Upvotes Not Allowed Against This Article.."});
                            }
                            
                             db.query("SELECT * from article_submissions where articleSubmissionID="+submissionID+" LIMIT 1", function (err, submission) { 
                                    
                                    if(submission.length < 1)
                                    {
                                         return res.status(200).json({success: false, errors: "Upvotes Not Allowed Against This Article.."});
                                    }
                                    else
                                    {
                                          db.query("SELECT * from upvotes where submissionID="+submissionID+" and likeByID="+userID+" LIMIT 1", function (err, res_like) 
                                          { 
                                               if(res_like.length < 1)
                                                {
                                                      var ins={
                                                            submissionID:submissionID,
                                                            likeByID:userID,
                                                            createdAt:createdAt                                                            
                                                           };
                                                           var likes=submission[0].upVotes+1;
                                                           db.query('INSERT INTO upvotes SET ?',ins, function (err, upv) {
                                                            var sql = "UPDATE article_submissions set upVotes=? WHERE articleSubmissionID = ?";       
                                                                    db.query(sql,[likes,submissionID], function (err, res_sub) { 
                                                                      return res.status(200).json({success: {'total_likes':likes,'type':'like'}, errors: false});
                                                                    });                                       
                                                                        
                                                            
                                                            });
                                                }
                                                else
                                                {
                                                    var likes=submission[0].upVotes-1;
                                                    db.query('DELETE FROM `upvotes` where likeByID=? and submissionID=?',[userID,submissionID], function (err, upv) {
                                                            var sql = "UPDATE article_submissions set upVotes=? WHERE articleSubmissionID = ?";       
                                                                    db.query(sql,[likes,submissionID], function (err, res_sub) { 
                                                                      
                                                                       return res.status(200).json({success: {'total_likes':likes,'type':'unlike'}, errors: false});
                                                                    });                                       
                                                                        
                                                            
                                                            });
                                                    
                                                }
                                          
                                          });
                                    }
                                });
                            
                            
                       }
                       else
                       {
                         return res.status(200).json({success: false, errors: "Upvoting Not Allowed Against This Article.."});
                       }               
                
                
                            
              });  
    }
    else
    {
       return res.status(200).json({success: false, errors: "Something Wrong."});
    } 
      
    
});


/**
 * Get Challenge Submissions for a Single Article
 *
 * @param {int} articleId - the articleID that you are trying to get the challenge submissions for
 * @author Ray Dollete <ray@raydollete.com>
 */
router.get('/articles/:id/submissions/', h.optionLogin, function(req, res) {

	var articleId = req.params.id;
	var userID = req.user.userID;

    var query = "   SELECT S.articleSubmissionID, S.articleID, S.userID, S.title AS `submissionTitle`, " +
                "    S.thumbUrl, S.createdAt, " +
                "    IF(U.displayName IS NULL, " +
                "     CONCAT(U.userFirstName, ' ', U.userLastName)," +
                "     U.displayName) as `userDisplayName`," +
                "    (SELECT count(articleSubmissionResponseID)" +
                "      FROM article_submission_response" +
                "      WHERE articleSubmissionID = S.articleSubmissionID" +
                "       and responseType = 'Upvote') AS `upvotes`," +
                "    (SELECT count(articleSubmissionResponseID)" +
                "      FROM article_submission_response" +
                "      WHERE articleSubmissionID = S.articleSubmissionID" +
                "       and responseType = 'Downvote') AS `downvotes`," +
				"	 IF(R.articleSubmissionResponseID IS NULL, " +
				"	  'false', 'true') as `userLiked`" +
		        "   FROM article_submission AS `S`" +
		        "   INNER JOIN users AS `U`" +
		        "    ON S.userID = U.userID" +
				" 	LEFT JOIN article_submission_response AS `R`" +
				"	 ON (S.articleSubmissionID = R.articleSubmissionID AND R.userID = '"+userID+"')" +
				"	WHERE S.articleID = '" + articleId + "' " +
		        "   ORDER BY createdAt";

    db.query(query, function(err, result) {

		if (err) {
			console.error(err.stack);
			res.status(500).send('Error while querying database');
		}

		else {
			// send result set as a JSON response
			res.status(200).json(result);
		}

	});

});


/**
 * Get Challenge Submission ID for a Single Article Belonging to a Specific UserID
 *
 * @param {int} articleId
 * @param {int} userId
 * @author Ray Dollete <ray@raydollete.com>
 */
router.get('/articles/:id/usersubmissions/:userId', h.tokenDecode, function(req, res) {
	var articleId = req.params.id;
	var userID = req.params.userId;


	var query = "   SELECT S.articleSubmissionID, S.articleID, S.userID, S.title AS `submissionTitle`, " +
		"    S.thumbUrl, S.createdAt, " +
		"    IF(U.displayName IS NULL, " +
		"     CONCAT(U.userFirstName, ' ', U.userLastName)," +
		"     U.displayName) as `userDisplayName`," +
		"    (SELECT count(articleSubmissionResponseID)" +
		"      FROM article_submission_response" +
		"      WHERE articleSubmissionID = S.articleSubmissionID" +
		"       and responseType = 'Upvote') AS `upvotes`," +
		"    (SELECT count(articleSubmissionResponseID)" +
		"      FROM article_submission_response" +
		"      WHERE articleSubmissionID = S.articleSubmissionID" +
		"       and responseType = 'Downvote') AS `downvotes`" +
		"   FROM article_submission AS `S`" +
		"   INNER JOIN users AS `U`" +
		"    ON S.userID = U.userID" +
		"	 AND U.userID = '"+userID+"'" +
		"	WHERE S.articleID = '" + articleId + "' " +
		"   LIMIT 1";

	db.query(query, function(err, result) {

		if (err) {
			console.error(err.stack);
			res.status(500).send('Error while querying database');
		}

		else {
			// send result set as a JSON response
			if(result.length > 0) {
				res.status(200).json(result[0]);
			}
			else {
				res.status(200).json({articleSubmissionID:0});
			}
		}

	});
});


/**
 * Get details about a single submission
 *
 * @param {int} article - articleID which the submission belongs to (placeholder for URL consistency)
 * @param {int} id - articleSubmissionID to get details on
 * @author Ray Dollete <ray@raydollete.com>
 */
router.get('/articles/:article/submissions/:id/', h.tokenDecode, function(req, res) {

	var subId = req.params.id;

	// get main information about the submission
	db.query("	SELECT S.userID, S.title, S.thumbUrl, S.createdAt," +
		"		 IF(U.displayName IS NULL, CONCAT(U.userFirstName, ' ', U.userLastName), U.displayName)" +
		"		  AS `userDisplayName`" +
		"		FROM article_submission S" +
		"		INNER JOIN users U" +
		"		 ON S.userID = U.userID" +
		"		WHERE articleSubmissionID = '" + subId + "' " +
		"		LIMIT 1", function(err, sub) {

		if (err) {
			console.error(err.stack);
			res.status(500).send('Error while querying database');
		}
		else {

			// empty result set
			if(sub.length == 0) {
				console.log('Empty set from query');
				res.status(200).json({
					success: false,
					errors: "Invalid articleSubmissionID ("+subId+")"
				});
			}
			else {

				// start building response object
				var result = {
					articleSubmissionID: subId,
					userID: sub[0].userID,
					userDisplayName: sub[0].userDisplayName,
					title: sub[0].title,
					thumbUrl: sub[0].thumbUrl,
					createdAt: sub[0].createdAt
				};

				console.log({result, sub})

				// get asset data
				db.query("	SELECT articleSubmissionAssetID, caption, assetType, assetPath, createdAt" +
					"		FROM article_submission_asset" +
					"		WHERE articleSubmissionID = '" + subId + "'" +
					"		ORDER BY createdAt", function(err, assets) {

					if (err) {
						console.error(err.stack);
						res.status(500).send('Error while querying database');
					}
					else {

						// add assets array to the result object
						result.assets = assets;

						// send response
						res.status(200).json(result);
					}

				}); // end asset query


			}


		}

	}); // end main query

});


/**
 * Update submission details (still pending, just updates submission metadata)
 *
 * @author Ray Dollete <ray@raydollete.com>
 */
/*
router.post('/articles/:article/submissions/:id/', h.ensureLogin, function(req, res) {

});
 */


/**
 * Delete a challenge submission
 *
 * @param {int} article - articleID which the submission belongs to
 * @param {int} id - articleSubmissionID
 * @param {bool} force - true|false force delete even if there are assets
 * @author Ray Dollete <ray@raydollete.com>
 */
router.delete('/articles/:article/submissions/:id/', h.ensureLogin, function(req, res) {

	var userID = req.user.userID;
	var articleID = req.params.article;
	var subID = req.params.id;
	var force = req.params.force;

	// validate the request data, checking articleID and userID verbosely to prevent unwanted deletes
	db.query("	SELECT articleSubmissionID" +
		"		FROM article_submission" +
		"		WHERE articleSubmissionID = '"+subID+"'" +
		"		 and articleID = '"+articleID+"'" +
		"		 and userID = '"+userID+"'" +
		"		LIMIT 1", function(err, check) {

		if (err) {
			console.error(err.stack);
			res.status(500).send('Error while querying database');
		}
		else {

			// empty result set
			if(check.length == 0) {
				res.status(200).json({
					success: false,
					errors: "Invalid articleSubmissionID ("+subID+") or user ("+userID+") does not have permission to delete"
				});
			}
			else {

				// run delete query
				var runDelQuery = function(subID) {

					db.query("DELETE FROM article_submission WHERE articleSubmissionID = '"+subID+"' LIMIT 1", function(err, result) {

						if(err) {
							console.error(err.stack);
							res.status(500).send('Error while deleting record in database');
						}
						else {

							// ensure row was deleted
							if(result.affectedRows == 1) {
								res.status(200).json({
									success: true
								});
							}
							else {
								res.status(200).json({
									success: false,
									affectedRows: result.affectedRows
								});
							}

						}

					}); // end delete query
				};

				// check if article submission has any assets
				db.query("SELECT count(articleSubmissionAssetID) AS num_assets FROM article_submission_asset WHERE articleSubmissionID = '"+subID+"'", function(err, assetCount) {

					if(err) {
						console.error(err.stack);
						res.status(500).send('Error while querying database');
					}
					else {
						console.log(assetCount);
						var count = assetCount[0].num_assets;
						if(count > 0) {

							// check to see if force delete is enabled
							if (force === 'true') {

								// delete ALL assets for this subID
								db.query("	DELETE FROM article_submission_asset" +
									"		WHERE articleSubmissionID = '"+subID+"'", function(err, result) {

									if(err) {
										console.error(err.stack);
										res.status(500).send('Error while force-deleting submission assets');
									}
									else {

										// ensure row was deleted
										if(result.affectedRows > 0) {

											// now go ahead and kill the subID
											runDelQuery(subID);
										}
										else {
											console.error(err.stack);
											res.status(500).send('Assets detected for subID ('+subID+') but not successfully deleted.');
										}

									}
								});

							}
							// otherwise
							else {
								res.status(200).json({
									success: false,
									errors: "Can't delete submission (" + subID + ") due to associated assets (" + count + ")"
								});
							}
						}

						else {
							runDelQuery(subID);
						}
					}

				}); // end asset check query

			}
		}
	}); // end validation query

});



/**
 * Add new challenge submission
 *
 * Requires JSON web token for { userID: <someUserID> }
 * Only one submission per article per user -- users can have multiple assets per submission
 *
 * @param {int} id - articleID
 * @param {string} submissionTitle - included in Body.form-data, min 3 characters
 * @author Ray Dollete <ray@raydollete.com>
 */
router.post('/articles/:id/submissions/new', h.ensureLogin, function(req, res) {

	var userID = req.user.userID;
	var articleID = req.params.id;

	// form processing
	const dateTime = Date.now();
	const timestamp = Math.floor(dateTime / 1000);
	var filenames = timestamp.toString();
	var createdAt = new Date();

	// first validate the data
	db.query("	SELECT A.articleID, A.articleAllowSubmission, S.articleSubmissionID," +
		"		 (SELECT userID from users WHERE userID = '" + userID + "' LIMIT 1) AS `userID`" +
		"		FROM articles A" +
		"		LEFT JOIN article_submission S" +
		"		 ON (A.articleID = S.articleID and S.userID = '" + userID + "')" +
		"		WHERE A.articleID = '" + articleID + "' " +
		"		LIMIT 1", function(err, check) {

		// error handling
		if(err || !Array.isArray(check)) {
			console.error(err.stack);
			res.status(200).json({
				success: false,
				errors: "Error while querying database."
			});
		}

		// no articleID found
		else if(check.length == 0) {
			res.status(200).json({
				success: false,
				errorCode: 1,
				errors: "The provided articleID ("+articleID+") is invalid."
			});

		}

		// allowArticleSubmission is something other than 'Yes'
		else if(check[0].articleAllowSubmission !== 'Yes') {
			res.status(200).json({
				success: false,
				errorCode: 2,
				errors: "The provided articleID does not allow user submissions."
			});
		}

		// no valid userID found in users table
		else if(check[0].userID === null) {
			res.status(200).json({
				success: false,
				errorCode: 3,
				errors: "The provided userID ("+userID+") is invalid.  req.user = "+ JSON.stringify(req.user)
			});
		}

		// found existing articleSubmission
		else if(check[0].articleSubmissionID !== null) {
			res.status(200).json({
				success: false,
				errorCode: 4,
				errors: "This userID ("+userID+") has already made an articleSubmissionID ("+check[0].articleSubmissionID+") to this articleID ("+articleID+")."
			});
		}

		else {

			// parse form
			var form = new formidable.IncomingForm();
			form.multiples = false;

			form.parse(req, function (err, fields, files) {

				if(err) {
					console.error(err.stack);
					res.status(200).json({
						success: false,
						errors: "Error while parsing user form."
					});
				}

				else {

					// build record to be inserted
					var submission = {
						articleID: articleID,
						userID: userID,
						title: (fields['submissionTitle']) ? fields['submissionTitle'] : '',
						status: "Draft"
					};

					// ensure minimum title length
					if(submission.title.length < 3) {
						res.status(200).json({
							success: false,
							errors: "The submission title ("+submission.title+") must be at least 3 characters long."
						});
					}

					else {

						// add to DB
						db.query("INSERT INTO article_submission SET ?", submission, function (err, result) {

							if(err) {
								console.error(err.stack);
								res.status(200).json({
									success:false,
									errors: "Error while inserting new record."
								});
							}

							else {

								res.status(200).json({
									success: true,
									data: submission,
									insertId: result.insertId
								});
							}
						});

					}
				}

			}); // end form.parse

		} // end big 'else'

	}); // end validation query

});


/**
 * Add an upvote to a challenge submission
 *
 * @param {int} article - placeholder
 * @param {int} id - the articleSubmissionID getting upvoted
 * @author Ray Dollete <ray@raydollete.com>
 */
router.post('/articles/:article/submissions/:id/upvote', h.ensureLogin, function(req, res) {

	var userID = req.user.userID;
	var articleSubmissionID = req.params.id;

	// validate the articleSubmissionID
	db.query("	SELECT articleSubmissionID" +
		"		FROM article_submission" +
		"		WHERE articleSubmissionID = '"+articleSubmissionID+"'" +
		"		LIMIT 1", function(err, check) {

		// error handling
		if(err || !Array.isArray(check)) {
			console.error(err.stack);
			res.status(200).json({
				success: false,
				errors: "Error while querying database."
			});
		}

		// no articleID found
		else if(check.length == 0) {
			res.status(200).json({
				success: false,
				errors: "The provided articleSubmissionID ("+articleSubmissionID+") is invalid."
			});

		}

		else {
			var subResponse = {
				articleSubmissionID: articleSubmissionID,
				userID: userID,
				responseType: 'Upvote'
			};

			db.query("INSERT INTO article_submission_response SET ?", subResponse, function (err, result) {

				if(err) {
					console.error(err.stack);
					res.status(200).json({
						success: false,
						errors: "Error while inserting new record."
					});
				}

				else {

					res.status(200).json({
						success: true,
						data: subResponse,
						insertId: result.insertId
					});
				}
			});
		}

	});

});


/**
 * Delete an upvote to a challenge submission
 *
 * @param {int} article - placeholder
 * @param {int} id - the articleSubmissionID getting upvoted
 * @author Ray Dollete <ray@raydollete.com>
 */
router.delete('/articles/:article/submissions/:id/upvote', h.ensureLogin, function(req, res) {

	var userID = req.user.userID;
	var articleSubmissionID = req.params.id;

	// delete the record
	db.query("	DELETE FROM article_submission_response" +
		"		WHERE articleSubmissionID = '"+articleSubmissionID+"'" +
		"		 and userID = '"+userID+"'" +
		"		LIMIT 1", function(err, result) {

		if(err) {
			console.error(err.stack);
			res.status(500).send('Error while deleting record in database');
		}
		else {

			// ensure row was deleted
			if(result.affectedRows === 1) {
				res.status(200).json({
					success: true,
					affectedRows: result.affectedRows
				});
			}
			else {
				res.status(200).json({
					success: false,
					affectedRows: result.affectedRows
				});
			}

		}


	});
});

/**
 * Add new challenge submission asset
 *
 * @param {int} id - articleSubmissionID
 * @param {string} caption - optional asset caption
 * @param {string} type - Image|Video|Text asset type
 * @param {file} assetfile - file upload (must be image as of 10/11)
 * @param {string} url - url of asset file (must be image as of 10/11)
 * @author Ray Dollete <ray@raydollete.com>
 */
router.post('/articles/:article/submissions/:id/asset/new', h.ensureLogin, function(req, res) {

	var userID = req.user.userID;
	var articleSubmissionID = req.params.id;

	// validate the articleSubmissionID
	db.query("	SELECT articleSubmissionID" +
		"		FROM article_submission" +
		"		WHERE articleSubmissionID = '"+articleSubmissionID+"'" +
		"		 and userID = '"+userID+"' " +
		"		LIMIT 1", function (err, check) {


		// error handling
		if(err || !Array.isArray(check)) {
			console.error(err.stack);
			res.status(200).json({
				success: false,
				errors: "Error while querying database."
			});
		}

		// no articleID found
		else if(check.length == 0) {
			res.status(200).json({
				success: false,
				errors: "The provided articleSubmissionID ("+articleSubmissionID+") is invalid or is not editable by this userID ("+userID+")."
			});

		}

		else {

			// parse form
			var form = new formidable.IncomingForm();
			form.multiples = false;

			form.parse(req, function (err, fields, files) {

				if(err) {
					console.error(err.stack);
					res.status(200).json({
						success: false,
						errors: "Error while parsing user form."
					});
				}

				else {

					var type = (fields['type']) ? fields['type'] : '';

					// define database insert query method (to be called after building record)
					var insertRecord = function(submissionAsset) {

						db.query("INSERT INTO article_submission_asset SET ?", submissionAsset, function (err, result) {

							if(err) {
								console.error(err.stack);
								res.status(200).json({
									success: false,
									errors: "Error while inserting new record."
								});
							}

							else {

								res.status(200).json({
									success: true,
									data: submissionAsset,
									insertId: result.insertId
								});
							}
						});

					};

					// validate assetType
					if(!type.match(/^(Image|Video|Text)$/)) {
						res.status(200).json({
							success: false,
							errors: "Invalid asset type specified ("+fields['type']+") -- needs to be Image, Video, or Text"
						});
					}

					else {

						// flag to figure out if the user uploaded a file or provided a URL
						var url = false;

						// intiialize shared vars
						var ext = null,
							filename = null,
							timestamp = Math.floor(Date.now() / 1000);
						var prefix = timestamp.toString();


						// user provided URL to asset
						if(fields['url']) {

							url = fields['url'];

							// ensure the URL has a proper filename
							ext = url.split('.').pop();

							if(!ext.match(/^(jpg|jpeg|gif|png)$/i)) {
								res.status(200).json({
									success: false,
									errors: "Invalid file reference extension from URL ("+url+")"
								});
							}

							else {

								// copy remote file to local storage (todo: this will be s3)
								filename = url.split('/').pop();
								var curl = fs.createWriteStream(path.join(storageDir, prefix+filename));

								http.get(url, function(response) {

									// todo: error handling

									response.pipe(curl);

									// build record to be inserted

									var submissionAsset = {
										articleSubmissionID: articleSubmissionID,
										caption: (fields['caption']) ? fields['caption'] : '',
										assetType: type,
										assetPath: prefix+filename
									};

									insertRecord(submissionAsset);
								});



							}

						}

						// process file upload
						else {

							// there must be at least one file posted
							if (Object.keys(files).length > 0 && files['assetfile']) {

								var assetfile = files['assetfile'];

								// get file extension of upload
								ext = assetfile.name.split('.').pop();

								// make sure this file has a valid extension
								if(!ext.match(/^(jpg|jpeg|gif|png)$/i)) {
									res.status(200).json({
										success: false,
										errors: "Invalid file upload extension ("+ext+")"
									});
								}

								else {

									// build destination path (within admin container) and filename
									form.uploadDir = storageDir;
									var oldpath = assetfile.path;
									filename = timestamp.toString() + assetfile.name;
									var fullpath = path.join(storageDir, prefix+filename);

									console.log('Writing file to ' + fullpath);

									// copy file out of temp
									fs.copy(oldpath, fullpath, function (err) {

										if (err) {
											console.error(err.stack);
											res.status(200).json({
												success: false,
												errors: "Error while writing file upload (" + fullpath + ")"
											});
										}

										else {

											// build public URL todo: move the prefix to ENV or config file
											url = filename;

											// test to ensure that file is publicly accessible

											// build record to be inserted
											var submissionAsset = {
												articleSubmissionID: articleSubmissionID,
												caption: (fields['caption']) ? fields['caption'] : '',
												assetType: type,
												assetPath: prefix+filename
											};

											insertRecord(submissionAsset);
										}

									});
								}

							}
							else {
								res.status(200).json({
									success: false,
									errors: "No valid URL or file upload provided"
								});
							}
						}


					}

				}

			});
		}
	});

});


/**
 * Update submission asset caption
 *
 * @param {int} id - articleSubmissionID
 * @param {string} caption - updated caption for this record
 * @author Ray Dollete <ray@raydollete.com>
 *
 */
/*router.post('/articles/:article/submissions/:sub/asset/:id', h.ensureLogin, function(req, res) {

});*/


/**
 * Delete a challenge submission asset
 *
 * @author Ray Dollete <ray@raydollete.com>
 */
router.delete('/articles/:article/submissions/:sub/asset/:id', h.ensureLogin, function(req, res) {

	var userID = req.user.userID;
	var articleID = req.params.article;
	var subID = req.params.sub; // do we want to use this for additional precaution?
	var assetID = req.params.id;

	// ensure that this asset is valid and the user has permission to delete
	db.query("	SELECT ASA.articleSubmissionAssetID, ASA.assetPath " +
		"		FROM article_submission_asset ASA " +
		"		INNER JOIN article_submission ASub " +
		"		 ON (ASA.articleSubmissionID = ASub.articleSubmissionID and ASub.userID = '"+userID+"')" +
		"		WHERE ASub.articleID = '"+articleID+"' and ASA.articleSubmissionAssetID = '"+assetID+"'" +
		"		LIMIT 1", function(err, check) {

		// error handling
		if(err || !Array.isArray(check)) {
			console.error(err.stack);
			res.status(200).json({
				success: false,
				errors: "Error while querying database to validate submission asset."
			});
		}
		else {

			// empty result set
			if(check.length == 0) {
				res.status(200).json({
					success: false,
					errors: "Invalid articleSubmissionAssetID ("+assetID+") or user ("+userID+") does not have permission to delete"
				});
			}

			else {

				var filename = check[0].assetPath;

				// private method for delete query
				var deleteQuery = function(assetID) {

					// delete the record
					db.query("	DELETE FROM article_submission_asset" +
						"		WHERE articleSubmissionAssetID = '"+assetID+"'" +
						"		LIMIT 1", function(err, result) {

						if(err) {
							console.error(err.stack);
							res.status(500).send('Error while deleting record in database');
						}
						else {

							// ensure row was deleted
							if(result.affectedRows === 1) {
								res.status(200).json({
									success: true,
									affectedRows: result.affectedRows
								});
							}
							else {
								res.status(200).json({
									success: false,
									affectedRows: result.affectedRows
								});
							}

						}


					});
				}; // end deleteQuery()


				// check if the file exists
				fs.pathExists(path.join(storageDir, filename), (err, exists) => {

					// if the file exists, try to delete it
					if(exists) {

						fs.remove(path.join(storageDir, filename), err => {

							if(!err) {
								deleteQuery(assetID);
							}
							else {
								console.error(err.stack);
								res.status(200).json({
									success: false,
									errors: "Error attempting to delete file ("+filename+")"
								});
							}

						});

					}

					// if the file is missing, delete the orphaned record
					else {
						console.log('Warning: Unable to find file on record ('+filename+') -- deleting orphan record');
						deleteQuery(assetID);
					}

				}); // end pathExists

			}

		}
	});
});



router.get('/articles/gallery/:id',h.tokenDecode,function(req, res){

	/**
     * example result
     *
     * {
    "result": [
        {
            "articleSubmissionID": 13,
            "articleID": 8,
            "userID": 13,
            "submissionTitle": "test",
            "submissionContent": "1504078762testupload.txt",
            "upVotes": 0,
            "downVotes": 0,
            "submissionStatus": "Approved",
            "createdAt": "2017-08-30T00:39:22.000Z",
            "userFirstName": "User",
            "userLastName": "Robbio"
        }
    ],
    "article": [
        {
            "articleAllowGallery": "Yes",
            "articleID": 8,
            "articleTitle": "TEMPUS DONEC",
            "articleSubmissionType": "File",
            "articleAllowUpvoting": "Yes"
        }
    ],
    "pagination": [
        {
            "page": 1,
            "per_page": 12,
            "total_pages": 1,
            "total": 1
        }
    ]
}
	 */
	var articleID=req.params.id;
    var page = req.query.page;
    var per_page=req.query.per_page;
    if(!page){ page=1; }
    if(!per_page){ per_page=12; }
    
    var offset = (page - 1) * per_page;
    var pagination=[];

    // if user is logged in...
    if(req.user)
    {
        var userID=req.user.userID; 
        var qry="SELECT article_submissions.*,users.userFirstName,users.userLastName,upvotes.likeByID  FROM article_submissions LEFT JOIN users on article_submissions.userID=users.userID LEFT JOIN upvotes on article_submissions.articleSubmissionID = upvotes.submissionID and upvotes.likeByID = "+userID+" where article_submissions.articleID="+articleID+" order by upVotes desc LIMIT "+offset+","+per_page;
    }
    else
    { 
        var qry="SELECT article_submissions.*,users.userFirstName,users.userLastName FROM article_submissions LEFT JOIN users on article_submissions.userID=users.userID where article_submissions.articleID="+articleID+" order by upVotes desc LIMIT "+offset+","+per_page;
    
    }
    db.query("SELECT articleAllowGallery,articleID,articleTitle,articleSubmissionType,articleAllowUpvoting  FROM articles where articleID="+articleID+" and articleStatus='Active'", function (err, article) {
        if(article.length ==0 )
        {
            return res.status(200).json('');
        }
        else
        {
            if(article[0]['articleAllowGallery']!='Yes')
            {
                return res.status(200).json('');
            }
        }
       db.query("SELECT count(*) as total FROM article_submissions where articleID="+articleID, function (err, all) {                            
                
                     db.query(qry, function (err, result) {                            
                        
                     var total_pages=Math.ceil(all[0]['total'] /per_page);
                        
                        pagination[0] = {
                            'page': page,
                            'per_page': per_page,
                            'total_pages': total_pages,
                            'total': all[0]['total']
                            };
                        
                        res.status(200).json({result,article,pagination});              
                      
                      
                      
                      });
                 });
            });   
     });



router.post('/articles/submission/:id',h.ensureLogin, function(req, res){ 
    var userID=req.user.userID;   
    var articleID=req.params.id;
     var form = new formidable.IncomingForm();    
     form.multiples = false;
     const dateTime = Date.now();
     const timestamp = Math.floor(dateTime / 1000);
     var filenames=timestamp.toString(); 
     var createdAt = new Date();
    
    
    if(articleID>0)
    {
         db.query("SELECT articles.* from articles  where articles.articleStatus='Active' and articleID="+articleID+" LIMIT 1", function (err, result) {                            
                        
                       if(result.length >0)
                       {
                            if(result[0]['articleAllowSubmission']!='Yes')
                            {
                                return res.status(200).json({success: false, errors: "Submission Not Allowed Against This Article.."});
                            }
                            
                             db.query("SELECT * from article_submissions  where  userID="+userID+" and articleID="+articleID+" LIMIT 1", function (err, submission) { 
                                    
                                    if(submission.length >0)
                                    {
                                        return res.status(200).json({success: false, errors: "Already Submit"});
                                    }
                                    else
                                    {
                                          form.parse(req, function (err, fields, files) {
                                                        var submissionTitle=fields['submissionTitle'];
                                                        if(!submissionTitle)
                                                        {
                                                            return res.status(200).json({success: false, errors: "submissionTitle are required"});
                                                        }
                                                        var submissionType=fields['submissionType'];
                                                        if(submissionType=="Photo")
                                                        {
                                                          
                                                            if(Object.keys(files).length==0)
                                                            {
                                                                return res.status(200).json({success: false, errors: "Photo are required"});
                                                            }
                                                            
                                                            
                                                             form.uploadDir = path.join(__dirname, '../storage/submission/photo/');
                                                             
                                                              var oldpath = files.file.path;
                                                           
                                                              filenames=filenames+files.file.name;
                                                              fs.copy(oldpath, path.join(form.uploadDir, filenames), function (err) {
                                                                  var ins={
                                                                        articleID:articleID,
                                                                        userID:userID,
                                                                        submissionTitle:submissionTitle,
                                                                        submissionContent:filenames,
                                                                        createdAt:createdAt
                                                                       };
                                                                       
                                                                       db.query('INSERT INTO article_submissions SET ?',ins, function (err, subs) {
                                                        						if (err) throw err;	
                                                                                 return res.status(200).json({success: true, errors:false});                                                        						
                                                        					  });
                                                                
                                                                
                                                                
                                                              });
                                                             
                                                           
                                                            
                                                            
                                                        }
                                                        else if(submissionType=="File")
                                                        {
                                                            if(Object.keys(files).length==0)
                                                            {
                                                                return res.status(200).json({success: false, errors: "File are required"});
                                                            }
                                                            
                                                            
                                                             form.uploadDir = path.join(__dirname, '../storage/submission/file/');
                                                             
                                                              var oldpath = files.file.path;
                                                           
                                                              filenames=filenames+files.file.name;
                                                              fs.copy(oldpath, path.join(form.uploadDir, filenames), function (err) {
                                                                  var ins={
                                                                        articleID:articleID,
                                                                        userID:userID,
                                                                        submissionTitle:submissionTitle,
                                                                        submissionContent:filenames,
                                                                        createdAt:createdAt
                                                                       };
                                                                       
                                                                       db.query('INSERT INTO article_submissions SET ?',ins, function (err, subs) {
                                                        						if (err) throw err;	
                                                                                 return res.status(200).json({success: true, errors:false});                                                        						
                                                        					  });
                                                                
                                                                
                                                              });
                                                            
                                                        }
                                                        else
                                                        {
                                                             var submissionContentVideo=fields['submissionContentVideo'];
                                                             if(!submissionContentVideo)
                                                             {
                                                                return res.status(200).json({success: false, errors: "submissionContentVideo are required"});
                                                             }
                                                             submissionContentVideo=submissionContentVideo.replace('watch?v=', 'embed/')
                                                             
                                                               var ins={
                                                                        articleID:articleID,
                                                                        userID:userID,
                                                                        submissionTitle:submissionTitle,
                                                                        submissionContent:submissionContentVideo,
                                                                        createdAt:createdAt
                                                                       };
                                                                       
                                                                       db.query('INSERT INTO article_submissions SET ?',ins, function (err, subs) {
                                                        						if (err) throw err;	
                                                                                 return res.status(200).json({success: true, errors:false});                                                        						
                                                        					  });
                                                        }
                                                        
                                                   
                                                    });
                                   
                                   }
                                });
                            
                            
                       }
                       else
                       {
                         return res.status(200).json({success: false, errors: "Submission Not Allowed Against This Article.."});
                       }               
                
                
                            
              });  
    }
    else
    {
       return res.status(200).json({success: false, errors: "Something Wrong."});
    } 
      
    
});





// add tag query
router.get('/articles/tag/:tag', function(req, res) {
	/*var page = req.query.page;
	var per_page=req.query.per_page;
	if(!page){ page=1; }
	if(!per_page){ per_page=10; }*/

    var tag = req.params.tag;
    db.query("   SELECT articles.articleID,articles.articleTitle,articles.articleDescription," +
        "           articles.articleImage,users.userFirstName,users.userLastName " +
        "        FROM articles " +
        "        LEFT JOIN users on articles.userID=users.userID " +
        "        WHERE articles.articleStatus='Active' " +
        "         AND articles.articleTags = '"+tag+"'" +
        "        ORDER by articleID desc", function (err, result) {

        res.status(200).json(result);
    });

});


router.get('/articles/top', function(req, res){   
     db.query(" SELECT articles.articleID,articles.articleTitle,articles.articleDescription,articles.articleImage,users.userFirstName,users.userLastName " +
         "      FROM articles " +
         "      LEFT JOIN users on articles.userID=users.userID " +
         "      WHERE articles.articleStatus='Active' " +
         // "      ORDER BY articleID DESC" +
         "      LIMIT 15", function (err, result) {
                res.status(200).json(result);               
              });
           });     
router.get('/articles/detail/:id', function(req, res){ 
    var articleID=req.params.id;
    if(articleID>0)
    {
         db.query("SELECT articles.*,users.userFirstName,users.userLastName FROM articles LEFT JOIN users on articles.userID=users.userID where articles.articleStatus='Active' and articleID="+articleID+" LIMIT 1", function (err, result) {                            
                res.status(200).json(result);               
              });  
    }
    else
    {
        res.status(200).json('');
    }             
});

router.get('/articles/related/:id', function(req, res){ 
    var articleID=req.params.id;
    if(articleID>0)
    {
         db.query("SELECT articles.articleID,articles.articleTitle,articles.articleDescription,articles.articleImage,users.userFirstName,users.userLastName FROM articles LEFT JOIN users on articles.userID=users.userID where articles.articleStatus='Active' and articleID!="+articleID+" LIMIT 8", function (err, result) {                            
                res.status(200).json(result);               
              });  
    }
    else
    {
        res.status(200).json('');
    }             
});


module.exports = router;
