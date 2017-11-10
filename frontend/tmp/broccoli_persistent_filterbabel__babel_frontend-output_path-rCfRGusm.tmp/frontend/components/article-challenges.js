define('frontend/components/article-challenges', ['exports', 'frontend/config/environment'], function (exports, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({
		serverURL: _environment.default.serverPath,
		classNames: ['article-challenge'],
		init: function init() {
			this._super.apply(this, arguments);
		}
	});
});