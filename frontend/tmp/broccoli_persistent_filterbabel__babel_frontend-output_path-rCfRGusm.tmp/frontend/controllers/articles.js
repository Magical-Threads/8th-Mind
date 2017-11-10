define('frontend/controllers/articles', ['exports', 'frontend/config/environment'], function (exports, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Controller.extend({
		serverURL: _environment.default.serverPath,
		rootUrl: _environment.default.rootURL,
		querParams: ['page'],
		page: 1,
		actions: {
			nextPage: function nextPage() {
				var page = this.get('page');
				this.set('page', page + 1);
			},
			prevPage: function prevPage() {
				var page = this.get('page');
				this.set('page', page - 1);
			}
		}
	});
});