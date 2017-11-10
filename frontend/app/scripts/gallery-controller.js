import Ember from 'ember';
import config from './../config/environment';

/* global Promise, $ */

export async function getGalleryModel(params) {

	const articleID = params.articleID;
	const authenticated = this.get('session.data.authenticated');
	const userID = authenticated.userID;

	/* Get the submissions to create the gallery */
	const submissionUrl = galleryAPI(articleID).allSubmissions;
	const submissionData = await Ember.$.get(submissionUrl);

	/*
		Get the "assetResults" after getting the submission ID, from the
		first call in "submissionData". Using the "await" keyword again on
		the map argument function to pause until we have that submission ID.
	*/
	const galleryData = submissionData.map(async function(submission) {
		const assetResults = await Ember.$.get(submissionUrl + submission.articleSubmissionID);
		const galleryArray = assetResults.assets.map(submission => {
			return {
				id: submission.articleSubmissionAssetID,
				date: submission.createdAt,
				image: config.serverPath + 'storage/submission/photo/' + submission.assetPath,
				caption: submission.caption
			};
		});
		return {
			userID: submission.userID,
			id: submission.articleSubmissionID,
			name: submission.userDisplayName,
			title: submission.submissionTitle,
			upVotes: submission.upvotes,
			downVotes: submission.downvotes,
			images: galleryArray.reverse(),
			thumb: submission.thumbUrl
		};
	});

	/*  Get the challenge article detail for the header */
	const challengeArticleUrl = config.serverPath + 'articles/detail/' + articleID;
	const challengeArticleData = await Ember.$.get(challengeArticleUrl);
	const articleData = challengeArticleData.map(article => {
		const ifYes = string => string.toLowerCase() === 'yes' ? true : false;
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
			rules: article.articleRules,
		}
	})[0];

	const galleryModel = {
		userID: userID,
		gallery: await Promise.all(galleryData),
		article: articleData
	};

	return galleryModel;
}

function deleteSubmission(assetDeleted, articleID, submissionID) {

	if (assetDeleted.success) {
		const api = galleryAPI(articleID);
		const url = api.submission(submissionID);
		this.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
			Ember.$.ajax({
				beforeSend(xhr) {
					xhr.setRequestHeader(headerName, headerValue);
				},
				url: url,
				type: 'DELETE',
				dataType: 'json',
				success(result) {
					/* Delete submission success! */
					Ember.$(`[data-submission-id=${submissionID}]`).hide();
					return result;
				},
				error(error) {
					/* There was an error deleting the submission. */
					return error;
				}
			});
		})
	}
}

export function deleteAsset(articleID, submissionID, assetID, session) {

	const self = this;
	const api = galleryAPI(articleID);
	const url = assetID ? api.asset(submissionID, assetID) : api.submission(submissionID);
	const userID = session.session.content.authenticated.userID;

	if (confirm('Are you sure you want to delete this submission?')) {
		this.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {

			Ember.$.ajax({
				beforeSend(xhr) {
					xhr.setRequestHeader(headerName, headerValue);
				},
				method: 'DELETE',
				url: url,
				async success(result) {

					if (!result.success) {
						self.get('flashMessages').warning('Sorry. You can’t delete this submission.');
					} else {

						self.get('flashMessages').success('Submission successfully deleted.');

						let submissionUrl = galleryAPI(articleID).allSubmissions;
						let submissionData = await Ember.$.get(submissionUrl);
						let userSubmission = filterUserSubmission(submissionData, userID);
						let userSubmissionResults = await Ember.$.get(submissionUrl + userSubmission.articleSubmissionID);

						$(`[data-asset-id=${assetID}]`).fadeOut();

						if (userSubmissionResults.assets.length === 0) {
							deleteSubmission.apply(self, [result, articleID, submissionID]);
						}

					}
				},
				error(error) {
					/* There was an error deleting the asset. */
					return error;
				}
			})
		});
	}
}

export async function createSubmission(articleID) {

	const api = galleryAPI(articleID);
	const allSubmissionsUrl = api.allSubmissions;
	const USER_ID = this.get('session').session.content.authenticated.userID;

	const addSubmissionForm = $('#add-submission')[0];
	const submissionObjectData = $('input[type=file]')[0].files[0];
	const formData = new FormData(addSubmissionForm);
	formData.append('type', 'Image');
	formData.append('assetfile', submissionObjectData);

	const allSubmissions = await Ember.$.get(allSubmissionsUrl);
	const userSubmission = await filterUserSubmission(allSubmissions, USER_ID);

	makeSubmissionRequest.apply(this, [
		articleID,
		userSubmission,
		formData
	]);
}

function makeSubmissionRequest(articleID, submission, formData) {
	const self = this;
	const submissionID = submission ? submission.articleSubmissionID : false;
	const api = galleryAPI(articleID);
	const url = submissionID ? api.newAsset(submissionID) : api.newSubmission;

	self.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
		Ember.$.ajax({
			beforeSend(xhr) {
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
			success(result) {
				if (!result.success) {
					self.get('flashMessages').warning(result.errors);
				} else {
					createSubmissionAsset.apply(self, [articleID, result])
				}
			},
			error(error) {
				return error;
			}
		})

	});
}

function filterUserSubmission(allSubmissions, userID) {
	return allSubmissions.filter(submission => submission.userID !== userID ? false : submission.articleSubmissionID)[0]
}

function createSubmissionAsset(articleID, response) {

	const self = this;
	const api = galleryAPI(articleID);
	const newAssetURL = api.newAsset(response.insertId);
	const form = $('#add-asset')[0];
	const formData = new FormData(form);
	formData.append('type', 'Image');
	formData.append('assetfile', $('#assetFile')[0].files[0]);

	self.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
		Ember.$.ajax({
			beforeSend(xhr) {
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
			success(result) {
				if (!result.success) {
					self.get('flashMessages').warning(result.errors);
				} else {
					// updateGallery;
					self.get('flashMessages').success('Asset successfully added');
				}
			},
			error(error) {
				// updateGallery;
				self.get('flashMessages').success('Creating submission asset error');
				return error;
			}
		});
	})
}

function galleryAPI(articleID) {
	const baseURL = config.serverPath + 'articles/' + articleID + '/submissions/'
	return {
		allSubmissions: baseURL,
		newSubmission: baseURL + 'new',
		submission: (submissionID) => (baseURL + submissionID),
		newAsset: (submissionID) => (baseURL + submissionID + '/asset/new'),
		asset: (submissionID, assetID) => (baseURL + submissionID + '/asset/' + assetID)
	};
}

export function handleUpvote(submissionID, articleID) {

	const gallerySubmission = $(`[data-submission-id="${submissionID}"`);

	if (submissionID > 0) {

		const api = galleryAPI(articleID);
		const url = api.submission(submissionID);

		this.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {

			// console.log({submissionID, articleID, headerName, headerValue, url})

			Ember.$.ajax({
				beforeSend: function(xhr) {
					xhr.setRequestHeader(headerName, headerValue);
				},
				method: 'POST',
				data: {
					articleID: articleID
				},
				url: url,
			}).then(data => {
				if (!data.success) {
					this.get('flashMessages').danger(data.errors);
				} else {
					var html = '';
					const heart = '<i class="icon-heart"><svg viewBox="0 0 96.6 85.1"><path class="icon-sprite heart--like" d="M96.6,26.5C96.6,11.9,84.7,0,70.1,0c-8.8,0-16.7,4.3-21.5,11l0,0l0,0C43.8,4.3,36,0,27.1,0 C12.5,0,0.6,11.9,0.6,26.5c0,7.9,3.5,15,8.9,19.8l39.1,38.8l39.4-39l0,0C93.3,41.2,96.6,34.3,96.6,26.5z"/></svg></i>';
					if (data.success.type == 'like') {
						html += data.success.total_likes + heart;
					} else {
						html -= data.success.total_likes + heart;
					}
					gallerySubmission.html(html);
				}
			})
		});
	}
}