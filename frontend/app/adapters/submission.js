import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
	buildURL(modelName, id, snapshot, requestType, query) {

		// console.log('submission apdapter',{modelName, id, snapshot, requestType, query})

		if (requestType === 'findRecord') {
			return `${this.host}/articles/${id}/submissions/`;
		}
		else if (requestType === 'peekRecord') {
			return `${this.host}/articles/${id}/submissions/`;
		}
		else if (requestType === 'deleteRecord') {

			const articleID = 		snapshot.adapterOptions.articleID
			const submissionID = 	snapshot.adapterOptions.submissionID;
			const assetID = 		snapshot.adapterOptions.assetID
			if (assetID) {
				const url = 			`${this.host}/articles/${articleID}/submissions/${submissionID}/asset/${assetID}`;
				// console.log('deleting...', url);
				return url;
			} else {
				const url = 			`${this.host}/articles/${articleID}/submissions/${submissionID}`;
				// console.log('deleting...', url);
				return url;
			}
		}
		else if (requestType === 'createRecord') {
			const articleID = 		snapshot.adapterOptions.articleID
			const url = 			`${this.host}/articles/${articleID}/submissions/new`;
			// console.log('Create record...', url);
			return url;
		}
		else {
			// console.log('@@@@ Unknown request type: ',requestType);
			return new Error(
				'Check submission adapter to support a new requestType.',
				'adapter/submission.js',
				modelName, id, snapshot, requestType, query);
		}
	},
	handleResponse(status, headers, payload) {
		console.log('@@@@ In handle response. Submission  Status: ',status,' headers: ',headers,' payload: ',payload);
		if (payload && payload.success) {
			if (payload.result) {
				return payload.result;
			} else {
				return this._super(status, headers, payload);
			}
		} else if (payload && !payload.success && payload.errors) {
			console.log('@@@@ Converting errors to JSON-API ',payload.errors,' ',typeof payload.errors)
			if (typeof payload.errors === 'string') {
				return {errors: [{title: payload.errors}]}
			} else {
				return this._super(status, headers, payload);
			}
		} else {
			return this._super(status, headers, payload);
		}
	}
});
