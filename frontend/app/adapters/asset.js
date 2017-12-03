import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
	buildURL(modelName, id, snapshot, requestType, query) {

		// console.log('asset apdapter',{modelName, id, snapshot, requestType, query})

		if (requestType === 'deleteRecord') {

			const articleID = 		snapshot.adapterOptions.articleID
			const submissionID = 	snapshot.adapterOptions.submissionID;
			const assetID = 		snapshot.adapterOptions.assetID
			const url = 			`${this.host}/articles/${articleID}/submissions/${submissionID}/asset/${assetID}`;
			// console.log('deleting...', url);
			return url;
		}
		else if (requestType === 'createRecord') {
			const articleID = 		snapshot.adapterOptions.articleID
			const submissionID = 	snapshot.adapterOptions.submissionID;
			const url = 			`${this.host}/articles/${articleID}/submissions/${submissionID}/asset/new`;
			// console.log('Create record...', url);
			return url;
		}
		else {
			// console.log('@@@@ Unknown request type: ',requestType);
			return new Error(
				'Check asset adapter to support a new requestType.',
				'adapter/submission.js',
				modelName, id, snapshot, requestType, query);
		}
	},
	handleResponse(status, headers, payload, requestData) {
		// console.log('@@@@ In handle response. Asset  Status: ',status,' headers: ',headers,' payload: ',payload);
		if (payload && payload.success) {
			if (payload.result) {
				return payload.result;
			} else {
				return this._super(status, headers, payload, requestData);
			}
		} else if (payload && !payload.success && payload.errors) {
			console.log('@@@@ Converting errors to JSON-API ',payload.errors,' ',typeof payload.errors)
			if (typeof payload.errors === 'string') {
				return this._super(status, headers, {errors: [{title: payload.errors}]}, requestData);
			} else {
				return this._super(status, headers, payload, requestData);
			}
		} else {
			return this._super(status, headers, payload, requestData);
		}
	}
});
