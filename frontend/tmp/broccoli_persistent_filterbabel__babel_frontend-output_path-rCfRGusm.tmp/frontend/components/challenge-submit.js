define('frontend/components/challenge-submit', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({
		session: Ember.inject.service('session'),
		classNames: ['challenge-submit'],
		actions: {
			createSubmission: function createSubmission() {}
		}
	});
});