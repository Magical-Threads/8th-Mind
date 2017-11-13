import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
	buildURL(modelName, id, snapshot, requestType, query) {
		if (requestType === 'findRecord') {
			return `${this.host}/${modelName}s/detail/${id}`;
		}
		else if (requestType === 'findAll') {
			return `${this.host}/${modelName}s/`;
		}
		else if (requestType === 'query') {
			return `${this.host}/${modelName}s/`;
		}
		else {
			return new Error('Configure your adapter for the requestType.', modelName, id, snapshot, requestType, query);
		}
	},
	pathForType() {
		return 'articles';
	},
	// handleResponse(a, b, c) {
	// 	console.log('@@@@ In handle response. Article  Status: ',a,' headers: ',b,' payload: ',c)
	// 	return this._super(a, b, c);
	// }
});
