import DS from 'ember-data';

export default DS.RESTSerializer.extend({
	mapSubmissions(submission) {
		return {
			id: 			submission.articleSubmissionID,
			title: 			submission.submissionTitle,
			name: 			submission.userDisplayName,
			votes: 			submission.upvotes,
			userID: 		submission.userID,
			thumb: 			submission.thumbUrl,
			dateCreated: 	submission.createdAt,
			articleID: 		submission.articleID,
			links: {
				assets: `/articles/${submission.articleID}/submissions/${submission.articleSubmissionID}`
			}
		};
	},
	normalizeResponse(store, primaryModelClass, payload, id, requestType) {

		if (requestType === 'findRecord') {
			payload = { submissions: payload.map(this.mapSubmissions) };
		}

		if (requestType === 'findHasMany') {
			payload = { submissions: payload.map(this.mapSubmissions) };
		}
		// console.log('serializer submission...',{store, primaryModelClass, payload, id, requestType})
		
		return this._super(store, primaryModelClass, payload, id, requestType);
	}
});
