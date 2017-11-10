define('frontend/helpers/is-a-challenge', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.isAChallenge = isAChallenge;
	function isAChallenge(boolean) {
		// Either true of false boolean
		var isChallenge = boolean[0];
		return isChallenge ? 'challenge' : 'article';
	}

	exports.default = Ember.Helper.helper(isAChallenge);
});