define('frontend/adapters/submission', ['exports', 'frontend/adapters/application'], function (exports, _application) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = _application.default.extend({
		buildURL: function buildURL(modelName, id, snapshot, requestType, query) {

			// console.log('submission apdapter',{modelName, id, snapshot, requestType, query})

			if (requestType === 'findRecord') {
				return this.host + '/articles/' + id + '/submissions/';
			} else if (requestType === 'peekRecord') {
				return this.host + '/articles/' + id + '/submissions/';
			} else if (requestType === 'deleteRecord') {

				var articleID = snapshot.adapterOptions.articleID;
				var submissionID = snapshot.adapterOptions.submissionID;
				var assetID = snapshot.adapterOptions.assetID;
				var url = this.host + '/articles/' + articleID + '/submissions/' + submissionID + '/asset/' + assetID;

				// console.log('deleting...', url);

				return url;
			} else {
				return new Error('Check submission adapter to support a new requestType.', 'adapter/submission.js', modelName, id, snapshot, requestType, query);
			}
		}
	}
	// handleResponse(a, b, c) {
	// 	console.log(a,b,c)

	// }
	);
});