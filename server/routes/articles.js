const express = require('express');
const router = express.Router();
const h = require('../helpers');
const db = require('../db');
const formidable = require('formidable');
const path = require('path');

const Article = require('../models/article');
const User = require('../models/user');
const Submission = require('../models/submission');
const Asset = require('../models/asset.js');
const Response = require('../models/response.js');

const config = require('../config/index');

// configuration (should move to ENV or config file)
const storageDir = config.storageDir;

/**
 * Primary articles index for home page
 *
 * @param {int} per_page - number of articles to show on a page
 * @param {int} page - which page of content to show
 * @param {int} time - hour in which articles are available on their start date (default 9am)
 */
router.get('/articles', function(req, res) {
	try {
		const page = parseInt(req.query.page) || 1;
		const per_page = parseInt(req.query.per_page) || 10;
		const tag = req.query.tag;
		const time = req.query.time ? parseInt(req.query.time) : 9

		Article.articles_on_page(page, per_page, tag, time).then((articles) => {
			Article.count(tag).then((total) => {
				let pagination=[];
				let total_pages = total / per_page;
				pagination[0] = {
					'page': page,
					'per_page': per_page,
					'total_pages': total_pages,
					'total': total
				};
				const result = articles.map(a => a.serialized);
				res.status(200).json({result,pagination});
			});
		}).catch((err) => {
			console.error('#### Error in querying articles', err);
			res.status(500).json({errors: [{title: 'Server error'}]});
		})
	} catch (err) {
		console.error('#### Error in route ', err);
		res.status(500).json({errors: [{title: 'Server error'}]});
	}
});

/* The following looks wrong on first read */
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
	try {
		var articleId = req.params.id;
		var userID = req.user.userID;

	  (new Article(articleId)).submissions_viewing_user(new User(userID)).then((subs) => {
			res.status(200).json(subs.map(s => s.serialized));
		}).catch((err) => {
			res.status(500).json({errors: [{title: 'Error in database access'}]});
		});
	} catch (err) {
		console.error('#### Server error: ',err);
		res.status(500).json({errors: [{title: 'Server error'}]});
	}
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
	try {
		const subID = parseInt(req.params.id);
		const userID = req.user.userID;

		(new Submission(subID)).load().then(async (sub) => {
			if (sub) {
				await sub.loadVotes(new User(userID));
				let data = sub.serialized;
				let assets = (await sub.assets()).map(a => a.serialized);
				data.assets = assets;
				res.status(200).json(data);
			} else {
				res.status(404).json({
					success: false,
					errors: [{title: 'Submission not found'}]
				})
			}
		}).catch((err) => {
			console.error('#### Error in request', err);
			res.status(500).json({
				success: false,
				errors: [{title: 'Server Error'}]
			});
		});
	} catch (err) {
		console.error('#### Error in request', err);
		res.status(500).json({
			success: false,
			errors: [{title: 'Server error'}]
		})
	}
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
	try {
		let userID = req.user.userID;
		let articleID = req.params.article;
		let subID = req.params.id;
		let force = req.query.force;

		// validate the request data, checking articleID and userID verbosely to prevent unwanted deletes
		(new Submission(subID)).load().then(async (submission) => {
			if (!submission) {
				return res.status(404).json({
					success: false,
					errors: [{title: "Invalid articleSubmissionID ("+subID+") or user ("+userID+") does not have permission to delete"}]
				});
			} else if (submission.articleID != articleID ||
				submission.userID != userID) {
				return res.status(403).json({
					success: false,
					errors: [{title: "Invalid articleSubmissionID ("+subID+") or user ("+userID+") does not have permission to delete"}]
				});
			} else {
				let assets = await submission.assets();
				if (force || assets.length == 0) {
					await submission.delete_all_assets();
					await submission.delete_submission(new User(userID));
					res.status(204).end();
				} else {
					let count = assets.length;
					res.status(409).json({
						success: false,
						errors: [{title: "Can't delete submission (" + subID + ") due to associated assets (" + count + ")"}]
					});
				}
			}
		})
		.catch((err) => {
			console.error('#### Error in delete request ',err);
			res.status(500).json({
				success: false,
				errors: [{title: 'Internal server error'}]
			});
		});
	} catch (err) {
		console.error('#### Server error: ',err);
		res.status(500).json({errors: [{title: 'Server error'}]});
	}
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
	try {
		var userID = req.user.userID;
		var articleID = req.params.id;

		// console.log('@@@@ Create new submission: ',userID,' article ',articleID,' body: ',req.body);

		// form processing
		const dateTime = Date.now();
		const timestamp = Math.floor(dateTime / 1000);
		var filenames = timestamp.toString();
		var createdAt = new Date();

		(new Article(articleID)).load().then(async (article) => {
			if (!article) {
				res.status(404).json({
					success: false,
					errorCode: 1,
					errors: [{title: "The provided articleID ("+articleID+") is invalid."}]
				});
				return;
			}
			let user = await (new User(userID)).load();
			if (!user) {
				res.status(404).json({
					success: false,
					errorCode: 1,
					errors: [{title: "The provided userID ("+userID+") is invalid."}]
				});
				return;
			}
			let submission = await article.submission_for_user(user);

			// no article found
			if (!article) {
				res.status(404).json({
					success: false,
					errorCode: 1,
					errors: [{title: "The provided articleID ("+articleID+") is invalid."}]
				});
			}

			// allowArticleSubmission is something other than 'Yes'
			else if (article.articleAllowSubmission !== 'Yes') {
				res.status(422).json({
					success: false,
					errorCode: 2,
					errors: [{title: "The provided articleID does not allow user submissions."}]
				});
			}

			// no valid userID found in users table
			else if (!user) {
				res.status(422).json({
					success: false,
					errorCode: 3,
					errors: [{title: "The provided userID ("+userID+") is invalid.  req.user = "+ JSON.stringify(req.user)}]
				});
			}

			// found existing articleSubmission
			else if (submission) {
				res.status(422).json({
					success: false,
					errorCode: 4,
					errors: [{title: "This userID ("+userID+") has already made an articleSubmissionID ("+submission.articleSubmissionID+") to this articleID ("+articleID+")."}]
				});
			}

			else {
				// build record to be inserted
				let submission = (new Submission(-1)).set({
					articleID: articleID,
					userID: userID,
					title: (req.body['submissionTitle']) ? req.body['submissionTitle'] : '',
					status: "Draft",
					createdAt: createdAt
				});

				// ensure minimum title length
				if (submission.title.length < 3) {
					res.status(422).json({
						success: false,
						errors: [{title: "The submission title ("+submission.title+") must be at least 3 characters long."}]
					});
				} else {
					submission = await submission.create();
					let u = await (new User(userID)).load();
					await submission.loadVotes(u);
					submission.userDisplayName = u.userFirstName+' '+u.userLastName;
					res.status(200).json({
						success: true,
						data: submission.serialized,
						insertId: submission.id
					});
				}
			}
		}).catch((err) => {
			console.error('#### Error in creating submission: ',err);
			res.status(500).json({errors: [{title: 'Server error'}]});
		});
	} catch (err) {
		console.error('#### Error in creating submission: ',err);
		res.status(500).json({errors: [{title: 'Server error'}]});
	}
});


/**
 * Add an upvote to a challenge submission
 *
 * @param {int} article - placeholder
 * @param {int} id - the articleSubmissionID getting upvoted
 * @author Ray Dollete <ray@raydollete.com>
 */
router.post('/articles/:article/submissions/:id/upvote', h.ensureLogin, function(req, res) {

	let userID = req.user.userID;
	let articleSubmissionID = req.params.id;

	// console.log('@@@@ Create new upvote: ',userID,' article ',articleSubmissionID);

	(new Submission(articleSubmissionID)).load().then(async (sub) => {
		if (!sub) {
			return res.status(404).json({
				success: false,
				errors: [{title: "The provided articleSubmissionID ("+articleSubmissionID+") is invalid."}]
			});
		}
		let response = await sub.response_for(new User(userID));
		if (response) {
			return res.status(422).json({
				success: false,
				errors: [{title: 'Duplicate upvote response'}]
			});
		}
		response = await (new Response(-1)).set({
			articleSubmissionID: articleSubmissionID,
			userID: userID,
			responseType: 'Upvote',
			createdAt: new Date()
		}).create();
		res.status(200).json({
			success: true,
			data: response.serialized,
			insertId: response.id
		});
	}).catch((err) => {
		console.error('#### Error in processing upvote', err);
		res.status(500).json({
			success: false,
			errors: [{title: 'Server error'}]
		});
	})
});


/**
 * Delete an upvote to a challenge submission
 *
 * @param {int} article - placeholder
 * @param {int} id - the articleSubmissionID getting upvoted
 * @author Ray Dollete <ray@raydollete.com>
 */
router.delete('/articles/:article/submissions/:id/upvote', h.ensureLogin, function(req, res) {

	const userID = req.user.userID;
	const articleSubmissionID = req.params.id;

	const sub = (new Submission(articleSubmissionID));
	const u = (new User(userID));
	sub.response_for(u).then((response) => {
		if (response) {
			response.delete().then(() => {
				res.status(200).json({
					success: true,
					affectedRows: 1
				});
			}).catch((err) => {
				console.error('#### Error in deleting upvote', err);
				res.status(500).json({
					success: false,
					errors: [{title: 'Server error'}]
				});
			});
		} else {
			res.status(404).json({
				success: false,
				errors: [{title: 'No upvote found'}]
			})
		}
	}).catch((err) => {
		console.error('#### Error in deleting upvote', err);
		res.status(500).json({
			success: false,
			errors: [{title: 'Server error'}]
		});
	})
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
router.post('/articles/:article/submissions/:id/asset/new', h.ensureLogin,
	function(req, res) {
	try {

		const userID = req.user.userID;
		const articleSubmissionID = req.params.id;

		(new Submission(articleSubmissionID)).load().then((sub) => {
			if (!sub || sub.userID != userID) {
				console.log('@@@@ Failed to find submission')
				res.status(404).json({
					success: false,
					errors: [{title: "The provided articleSubmissionID ("+articleSubmissionID+") is invalid or is not editable by this userID ("+userID+")."}]
				});
			} else {
				// parse form
				var form = new formidable.IncomingForm();
				form.multiples = false;
				form.parse(req, function (err, fields, files) {
					if (err) {
						console.error(err);
						console.error(err.stack);
						res.status(500).json({
							success: false,
							errors: [{title: "Error while parsing user form."}]
						});
					} else {
						let type = (fields['type']) ? fields['type'] : '';
						// validate assetType
						if (!type.match(/^(Image|Video|Text)$/)) {
							res.status(422).json({
								success: false,
								errors: [{title: "Invalid asset type specified ("+fields['type']+") -- needs to be Image, Video, or Text"}]
							});
						} else {
							let url = fields['url'];
							// intiialize shared vars
							let timestamp = Math.floor(Date.now() / 1000);
							let prefix = timestamp.toString();
							// user provided URL to asset
							if (fields['url']) {
								// ensure the URL has a proper filename
								let ext = url.split('.').pop();
								if (!ext.match(/^(jpg|jpeg|gif|png)$/i)) {
									res.status(422).json({
										success: false,
										errors: [{title: "Invalid file reference extension from URL ("+url+")"}]
									});
								} else {
									let filename = url.split('/').pop();
									let destination = path.join(storageDir, prefix+filename);
									(Asset.copy_url_to_storage(url, destination)).then(async () => {
										let submissionAsset = {
											articleSubmissionID: articleSubmissionID,
											caption: (fields['caption']) ? fields['caption'] : '',
											assetType: type,
											assetPath: prefix+filename
										};
										let a = await (new Asset()).set(submissionAsset).create();
										res.status(200).json({
											success: true,
											data: submissionAsset,
											insertId: a.id
										});
								}).catch((err) => {
										console.error('#### Error in processing upload.');
										res.status(200).json({
											success: false,
											errors: [{title: "Error while inserting new asset record."}]
										});
									});
								}
							} else {
								// Process file upload
								// there must be at least one file posted
								if (Object.keys(files).length > 0 && files['assetfile']) {
									let assetfile = files['assetfile'];
									// get file extension of upload
									let ext = assetfile.name.split('.').pop();
									// make sure this file has a valid extension
									if (!ext.match(/^(jpg|jpeg|gif|png)$/i)) {
										res.status(422).json({
											success: false,
											errors: [{title: "Invalid file upload extension ("+ext+")"}]
										});
									} else {
										// build destination path (within admin container) and filename
										form.uploadDir = storageDir;
										let oldpath = assetfile.path;
										let filename = timestamp.toString() + assetfile.name;
							 			let fullpath = path.join(storageDir, prefix+filename);
										// copy file out of temp
										Asset.copy_local_file(oldpath, fullpath).then(async () => {
											var submissionAsset = {
												articleSubmissionID: articleSubmissionID,
												caption: (fields['caption']) ? fields['caption'] : '',
												assetType: type,
												assetPath: prefix+filename
											};
											let a = await (new Asset()).set(submissionAsset).create();
											res.status(200).json({
												success: true,
												data: submissionAsset,
												insertId: a.id
											});
										}).catch((err) => {
											console.error(err);
											console.error(err.stack);
											res.status(500).json({
												success: false,
												errors: [{title: "Error while writing file upload (" + fullpath + ")"}]
											});
										});
									}
								}
							}
						}
					}
				});
			}
		});
	} catch (err) {
		console.error('#### Error in server: ',err);
		res.status(500).json({errors: [{title: 'Server error'}]});
	}
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
	try {
		const userID = req.user.userID;
		const articleID = req.params.article;
		const subID = req.params.sub; // do we want to use this for additional precaution?
		const assetID = req.params.id;

		(new Submission(subID)).assets_for_user(userID).then((assets) => {;
			let promises = []
			for (let a of assets) {
				if (a.id == assetID) {
				 	promises.push(a.delete());
				}
			}
			Promise.all(promises).then(() => {
				res.status(200).json({
					success: true,
					affectedRows: assets.length,
				});
			}).catch((err) => {
				console.error('#### Error in deleteing assets for user', err);
				res.status(500).json({
					success: false,
					errors: [{title: "Error deleting assets."}]
				});
			})
		});
	} catch (err) {
		console.error('#### Server error: ',err);
		res.status(500).json({success: false, errors: [{title: 'Server error'}]})
	}
});



router.get('/articles/gallery/:id',h.tokenDecode,function(req, res) {

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
    ]}
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
