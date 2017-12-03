import DS from 'ember-data';

export default DS.RESTSerializer.extend({
	mapSubmissions(submission) {
		// console.log('@@@@ Normalizing submission: ',submission);
		return {
			id: 			    submission.articleSubmissionID,
			title: 			  submission.title,
			name: 			  submission.userDisplayName,
			votes:			  submission.totalUpvotes,
			upvote:				submission.upvote,
			userID: 		  submission.userID,
			thumb: 			  submission.thumbUrl,
			dateCreated: 	submission.createdAt,
			articleID: 		submission.articleID,
			userDisplayName: submission.userDisplayName,
			links: {
				assets: `/articles/${submission.articleID}/submissions/${submission.articleSubmissionID}`
			}
		};
	},
	normalizeDeleteRecordResponse(store, primaryModelClass, payload, id, requestType) {
		// console.log('@@@@ Response from delete record: ',payload);
		return {data: {
			type: 'submission',
			id: id
		}};
	},
	normalizeFindRecordResponse(store, primaryModelClass, payload, id, requestType) {
		// console.log('@@@@ findRecord submission response: ',payload,' for: ',id,' requestType: ',requestType);
		if (Array.isArray(payload) && payload.length > 0) {
			payload = { submission: payload.map(this.mapSubmissions)[0] };
			return this._super(store, primaryModelClass, payload, id, requestType);
		} else {
			throw new DS.AdapterError();
		}
	},
	serializeIntoHash(hash, typeClass, snapshot, options) {
		// console.log('@@@@ Serialize to server: ',snapshot,' options: ',options);
		hash.submissionTitle = snapshot.attributes().title;
		// console.log('@@@@ Hash as serialized: ',hash);
	},
	normalizeFindHasManyResponse(store, primaryModelClass, payload, id, requestType) {
		payload = { submissions: payload.map(this.mapSubmissions) };
		// console.log('serializer submission...',{store, primaryModelClass, payload, id, requestType})
		return this._super(store, primaryModelClass, payload, id, requestType);
	},
	normalizeSaveResponse(store, primaryModelClass, payload, id, requestType) {
		// console.log('@@@@ Save response payload: ',payload,' id: ',id, ' requestType: ',requestType);
		if (requestType === 'createRecord') {
			return {data: {
				type: 'submission',
				attributes: this.mapSubmissions(payload.data),
				id: payload.insertId
			}};
		} else {
			// console.log('@@@@ Returning JSON API format response for ',requestType)
			return {data: {
				type: 'submission',
				id: id
			}};
		}
	}
});
