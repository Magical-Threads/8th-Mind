define('frontend/helpers/get-post-row-class', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.getPostRowClass = getPostRowClass;
	function getPostRowClass(params) {
		var articles = params[0];
		return articles.length === 6 ? 'post-row-length-1' : articles.length === 7 ? 'post-row-length-2' : '';
	}

	exports.default = Ember.Helper.helper(getPostRowClass);
});