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
			const url = 			`${this.host}/articles/${articleID}/submissions/${submissionID}/asset/${assetID}`;

			// console.log('deleting...', url);

			return url;
		}
		else {
			return new Error(
				'Check submission adapter to support a new requestType.', 
				'adapter/submission.js',  
				modelName, id, snapshot, requestType, query);
		}
	},
	// handleResponse(a, b, c) {
	// 	console.log(a,b,c)

	// }
});