define('frontend/scripts/gallery-controller', ['exports', 'frontend/config/environment'], function (exports, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.createSubmission = exports.getGalleryModel = undefined;
	exports.deleteAsset = deleteAsset;
	exports.handleUpvote = handleUpvote;

	function _asyncToGenerator(fn) {
		return function () {
			var gen = fn.apply(this, arguments);
			return new Promise(function (resolve, reject) {
				function step(key, arg) {
					try {
						var info = gen[key](arg);
						var value = info.value;
					} catch (error) {
						reject(error);
						return;
					}

					if (info.done) {
						resolve(value);
					} else {
						return Promise.resolve(value).then(function (value) {
							step("next", value);
						}, function (err) {
							step("throw", err);
						});
					}
				}

				return step("next");
			});
		};
	}

	var getGalleryModel = exports.getGalleryModel = function () {
		var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(params) {
			var articleID, authenticated, userID, submissionUrl, submissionData, galleryData, challengeArticleUrl, challengeArticleData, articleData, galleryModel;
			return regeneratorRuntime.wrap(function _callee2$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							articleID = params.articleID;
							authenticated = this.get('session.data.authenticated');
							userID = authenticated.userID;

							/* Get the submissions to create the gallery */

							submissionUrl = galleryAPI(articleID).allSubmissions;
							_context2.next = 6;
							return Ember.$.get(submissionUrl);

						case 6:
							submissionData = _context2.sent;


							/*
       	Get the "assetResults" after getting the submission ID, from the
       	first call in "submissionData". Using the "await" keyword again on
       	the map argument function to pause until we have that submission ID.
       */
							galleryData = submissionData.map(function () {
								var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(submission) {
									var assetResults, galleryArray;
									return regeneratorRuntime.wrap(function _callee$(_context) {
										while (1) {
											switch (_context.prev = _context.next) {
												case 0:
													_context.next = 2;
													return Ember.$.get(submissionUrl + submission.articleSubmissionID);

												case 2:
													assetResults = _context.sent;
													galleryArray = assetResults.assets.map(function (submission) {
														return {
															id: submission.articleSubmissionAssetID,
															date: submission.createdAt,
															image: _environment.default.serverPath + 'storage/submission/photo/' + submission.assetPath,
															caption: submission.caption
														};
													});
													return _context.abrupt('return', {
														userID: submission.userID,
														id: submission.articleSubmissionID,
														name: submission.userDisplayName,
														title: submission.submissionTitle,
														upVotes: submission.upvotes,
														downVotes: submission.downvotes,
														images: galleryArray.reverse(),
														thumb: submission.thumbUrl
													});

												case 5:
												case 'end':
													return _context.stop();
											}
										}
									}, _callee, this);
								}));

								return function (_x2) {
									return _ref2.apply(this, arguments);
								};
							}());

							/*  Get the challenge article detail for the header */

							challengeArticleUrl = _environment.default.serverPath + 'articles/detail/' + articleID;
							_context2.next = 11;
							return Ember.$.get(challengeArticleUrl);

						case 11:
							challengeArticleData = _context2.sent;
							articleData = challengeArticleData.map(function (article) {
								var ifYes = function ifYes(string) {
									return string.toLowerCase() === 'yes' ? true : false;
								};
								return {
									id: article.articleID,
									gallery: ifYes(article.articleAllowGallery),
									upVoting: ifYes(article.articleAllowUpvoting),
									comments: ifYes(article.articleAllowComment),
									submissions: ifYes(article.articleAllowSubmission),
									submissionType: article.articleSubmissionType,
									dateStart: article.articleStartDate,
									dateEndVoting: article.articleEndVotingDate,
									dateCreated: article.createdAt,
									dateExpires: article.articleExpireDate,
									dateUpdated: article.updatedAt,
									image: article.articleImage,
									title: article.articleTitle,
									author: article.userFirstName + ' ' + article.userLastName,
									rules: article.articleRules
								};
							})[0];
							_context2.t0 = userID;
							_context2.next = 16;
							return Promise.all(galleryData);

						case 16:
							_context2.t1 = _context2.sent;
							_context2.t2 = articleData;
							galleryModel = {
								userID: _context2.t0,
								gallery: _context2.t1,
								article: _context2.t2
							};
							return _context2.abrupt('return', galleryModel);

						case 20:
						case 'end':
							return _context2.stop();
					}
				}
			}, _callee2, this);
		}));

		return function getGalleryModel(_x) {
			return _ref.apply(this, arguments);
		};
	}();

	function deleteSubmission(assetDeleted, articleID, submissionID) {

		if (assetDeleted.success) {
			var api = galleryAPI(articleID);
			var url = api.submission(submissionID);
			this.get('session').authorize('authorizer:oauth2', function (headerName, headerValue) {
				Ember.$.ajax({
					beforeSend: function beforeSend(xhr) {
						xhr.setRequestHeader(headerName, headerValue);
					},

					url: url,
					type: 'DELETE',
					dataType: 'json',
					success: function success(result) {
						/* Delete submission success! */
						Ember.$('[data-submission-id=' + submissionID + ']').hide();
						return result;
					},
					error: function error(_error) {
						/* There was an error deleting the submission. */
						return _error;
					}
				});
			});
		}
	}

	function deleteAsset(articleID, submissionID, assetID, session) {

		var self = this;
		var api = galleryAPI(articleID);
		var url = assetID ? api.asset(submissionID, assetID) : api.submission(submissionID);
		var userID = session.session.content.authenticated.userID;

		if (confirm('Are you sure you want to delete this submission?')) {
			this.get('session').authorize('authorizer:oauth2', function (headerName, headerValue) {

				Ember.$.ajax({
					beforeSend: function beforeSend(xhr) {
						xhr.setRequestHeader(headerName, headerValue);
					},

					method: 'DELETE',
					url: url,
					success: function () {
						var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(result) {
							var submissionUrl, submissionData, userSubmission, userSubmissionResults;
							return regeneratorRuntime.wrap(function _callee3$(_context3) {
								while (1) {
									switch (_context3.prev = _context3.next) {
										case 0:
											if (result.success) {
												_context3.next = 4;
												break;
											}

											self.get('flashMessages').warning('Sorry. You can’t delete this submission.');
											_context3.next = 15;
											break;

										case 4:

											self.get('flashMessages').success('Submission successfully deleted.');

											submissionUrl = galleryAPI(articleID).allSubmissions;
											_context3.next = 8;
											return Ember.$.get(submissionUrl);

										case 8:
											submissionData = _context3.sent;
											userSubmission = filterUserSubmission(submissionData, userID);
											_context3.next = 12;
											return Ember.$.get(submissionUrl + userSubmission.articleSubmissionID);

										case 12:
											userSubmissionResults = _context3.sent;


											$('[data-asset-id=' + assetID + ']').fadeOut();

											if (userSubmissionResults.assets.length === 0) {
												deleteSubmission.apply(self, [result, articleID, submissionID]);
											}

										case 15:
										case 'end':
											return _context3.stop();
									}
								}
							}, _callee3, this);
						}));

						function success(_x3) {
							return _ref3.apply(this, arguments);
						}

						return success;
					}(),
					error: function error(_error2) {
						/* There was an error deleting the asset. */
						return _error2;
					}
				});
			});
		}
	}

	var createSubmission = exports.createSubmission = function () {
		var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(articleID) {
			var api, allSubmissionsUrl, USER_ID, addSubmissionForm, submissionObjectData, formData, allSubmissions, userSubmission;
			return regeneratorRuntime.wrap(function _callee4$(_context4) {
				while (1) {
					switch (_context4.prev = _context4.next) {
						case 0:
							api = galleryAPI(articleID);
							allSubmissionsUrl = api.allSubmissions;
							USER_ID = this.get('session').session.content.authenticated.userID;
							addSubmissionForm = $('#add-submission')[0];
							submissionObjectData = $('input[type=file]')[0].files[0];
							formData = new FormData(addSubmissionForm);

							formData.append('type', 'Image');
							formData.append('assetfile', submissionObjectData);

							_context4.next = 10;
							return Ember.$.get(allSubmissionsUrl);

						case 10:
							allSubmissions = _context4.sent;
							_context4.next = 13;
							return filterUserSubmission(allSubmissions, USER_ID);

						case 13:
							userSubmission = _context4.sent;


							makeSubmissionRequest.apply(this, [articleID, userSubmission, formData]);

						case 15:
						case 'end':
							return _context4.stop();
					}
				}
			}, _callee4, this);
		}));

		return function createSubmission(_x4) {
			return _ref4.apply(this, arguments);
		};
	}();

	function makeSubmissionRequest(articleID, submission, formData) {
		var self = this;
		var submissionID = submission ? submission.articleSubmissionID : false;
		var api = galleryAPI(articleID);
		var url = submissionID ? api.newAsset(submissionID) : api.newSubmission;

		self.get('session').authorize('authorizer:oauth2', function (headerName, headerValue) {
			Ember.$.ajax({
				beforeSend: function beforeSend(xhr) {
					xhr.setRequestHeader(headerName, headerValue);
				},

				method: 'POST',
				url: url,
				enctype: 'multipart/form-data',
				processData: false,
				contentType: false,
				cache: false,
				dataType: 'json',
				data: formData,
				success: function success(result) {
					if (!result.success) {
						self.get('flashMessages').warning(result.errors);
					} else {
						createSubmissionAsset.apply(self, [articleID, result]);
					}
				},
				error: function error(_error3) {
					return _error3;
				}
			});
		});
	}

	function filterUserSubmission(allSubmissions, userID) {
		return allSubmissions.filter(function (submission) {
			return submission.userID !== userID ? false : submission.articleSubmissionID;
		})[0];
	}

	function createSubmissionAsset(articleID, response) {

		var self = this;
		var api = galleryAPI(articleID);
		var newAssetURL = api.newAsset(response.insertId);
		var form = $('#add-asset')[0];
		var formData = new FormData(form);
		formData.append('type', 'Image');
		formData.append('assetfile', $('#assetFile')[0].files[0]);

		self.get('session').authorize('authorizer:oauth2', function (headerName, headerValue) {
			Ember.$.ajax({
				beforeSend: function beforeSend(xhr) {
					xhr.setRequestHeader(headerName, headerValue);
				},

				url: newAssetURL,
				type: 'POST',
				enctype: 'multipart/form-data',
				processData: false,
				contentType: false,
				cache: false,
				timeout: 600000,
				data: formData,
				success: function success(result) {
					if (!result.success) {
						self.get('flashMessages').warning(result.errors);
					} else {
						// updateGallery;
						self.get('flashMessages').success('Asset successfully added');
					}
				},
				error: function error(_error4) {
					// updateGallery;
					self.get('flashMessages').success('Creating submission asset error');
					return _error4;
				}
			});
		});
	}

	function galleryAPI(articleID) {
		var baseURL = _environment.default.serverPath + 'articles/' + articleID + '/submissions/';
		return {
			allSubmissions: baseURL,
			newSubmission: baseURL + 'new',
			submission: function submission(submissionID) {
				return baseURL + submissionID;
			},
			newAsset: function newAsset(submissionID) {
				return baseURL + submissionID + '/asset/new';
			},
			asset: function asset(submissionID, assetID) {
				return baseURL + submissionID + '/asset/' + assetID;
			}
		};
	}

	function handleUpvote(submissionID, articleID) {
		var _this = this;

		var gallerySubmission = $('[data-submission-id="' + submissionID + '"');

		if (submissionID > 0) {

			var api = galleryAPI(articleID);
			var url = api.submission(submissionID);

			this.get('session').authorize('authorizer:oauth2', function (headerName, headerValue) {

				// console.log({submissionID, articleID, headerName, headerValue, url})

				Ember.$.ajax({
					beforeSend: function beforeSend(xhr) {
						xhr.setRequestHeader(headerName, headerValue);
					},
					method: 'POST',
					data: {
						articleID: articleID
					},
					url: url
				}).then(function (data) {
					if (!data.success) {
						_this.get('flashMessages').danger(data.errors);
					} else {
						var html = '';
						var heart = '<i class="icon-heart"><svg viewBox="0 0 96.6 85.1"><path class="icon-sprite heart--like" d="M96.6,26.5C96.6,11.9,84.7,0,70.1,0c-8.8,0-16.7,4.3-21.5,11l0,0l0,0C43.8,4.3,36,0,27.1,0 C12.5,0,0.6,11.9,0.6,26.5c0,7.9,3.5,15,8.9,19.8l39.1,38.8l39.4-39l0,0C93.3,41.2,96.6,34.3,96.6,26.5z"/></svg></i>';
						if (data.success.type == 'like') {
							html += data.success.total_likes + heart;
						} else {
							html -= data.success.total_likes + heart;
						}
						gallerySubmission.html(html);
					}
				});
			});
		}
	}
});