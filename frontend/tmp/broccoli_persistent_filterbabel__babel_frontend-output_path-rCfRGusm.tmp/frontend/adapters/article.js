define('frontend/adapters/article', ['exports', 'frontend/adapters/application'], function (exports, _application) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = _application.default.extend({
		buildURL: function buildURL(modelName, id, snapshot, requestType, query) {
			if (requestType === 'findRecord') {
				return this.host + '/' + modelName + 's/detail/' + id;
			} else if (requestType === 'findAll') {
				return this.host + '/' + modelName + 's/';
			} else if (requestType === 'query') {
				return this.host + '/' + modelName + 's/';
			} else {
				return new Error('Configure your adapter for the requestType.', modelName, id, snapshot, requestType, query);
			}
		},
		pathForType: function pathForType() {
			return 'articles';
		}
	});
});