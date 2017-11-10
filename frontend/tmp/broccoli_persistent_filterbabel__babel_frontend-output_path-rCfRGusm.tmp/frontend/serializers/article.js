define('frontend/serializers/article', ['exports', 'ember-data'], function (exports, _emberData) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = _emberData.default.RESTSerializer.extend({
		normalizeResponse: function normalizeResponse(store, primaryModelClass, payload, id, requestType) {

			var convertToBoolean = function convertToBoolean(string) {
				return string.toLowerCase() === 'yes' ? true : false;
			};

			if (requestType === 'findRecord') {
				payload = {
					article: payload.map(function (article) {
						return {
							id: article.articleID,
							articleID: article.articleID,
							image: article.articleImage,
							title: article.articleTitle,
							body: article.articleDescription,
							allowComment: convertToBoolean(article.articleAllowComment),
							allowGallery: convertToBoolean(article.articleAllowGallery),
							allowSubmission: convertToBoolean(article.articleAllowSubmission),
							allowVoting: convertToBoolean(article.articleAllowUpvoting),
							dateEndVoting: article.articleEndVotingDate,
							dateExpire: article.articleExpireDate,
							dateCreated: article.createdAt,
							dateUpdated: article.updatedAt,
							rules: article.articleRules,
							dateStart: article.articleStartDate,
							status: article.articleStatus,
							submissionType: article.articleSubmissionType,
							userID: article.userID,
							tag: article.articleTags,
							url: 'http://8thmind.com/article/' + article.articleID,
							links: {
								submissions: '/articles/' + article.articleID + '/submissions/'
							}
						};
					})[0]
				};
			} else {
				payload = {
					articles: payload.result.map(function (article) {
						return {
							id: article.articleID,
							body: article.articleDescription,
							articleID: article.articleID,
							image: article.articleImage,
							dateStart: article.articleStartDate,
							tag: article.articleTags,
							title: article.articleTitle,
							firstName: article.userFirstName,
							lastName: article.userLastName
						};
					})
				};
			}
			// console.log(`Payload for requestType: ${requestType}`, payload)
			return this._super(store, primaryModelClass, payload, id, requestType);
		}
	});
});