define('frontend/routes/activate', ['exports', 'ember-cli-reset-scroll'], function (exports, _emberCliResetScroll) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Route.extend(_emberCliResetScroll.default, {
		resetScroll: 0
	});
});