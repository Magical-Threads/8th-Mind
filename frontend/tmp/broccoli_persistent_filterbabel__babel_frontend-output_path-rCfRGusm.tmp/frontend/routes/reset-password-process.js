define('frontend/routes/reset-password-process', ['exports', 'ember-cli-reset-scroll'], function (exports, _emberCliResetScroll) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Route.extend(_emberCliResetScroll.default, {
		title: '8th Mind: Reset Your Password',
		resetScroll: 0
	});
});