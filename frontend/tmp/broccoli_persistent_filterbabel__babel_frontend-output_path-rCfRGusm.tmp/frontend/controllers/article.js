define('frontend/controllers/article', ['exports', 'frontend/config/environment'], function (exports, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Controller.extend({
		session: Ember.inject.service('session'),
		serverURL: _environment.default.serverPath,
		rootUrl: _environment.default.rootURL
	});
});