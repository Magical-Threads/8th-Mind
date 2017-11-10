define('frontend/helpers/category-tag', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.categoryTag = categoryTag;
	function categoryTag(category) {
		var firstLetterOfCategory = category[0] === undefined ? '' : category[0].split('')[0];
		return firstLetterOfCategory;
	}

	exports.default = Ember.Helper.helper(categoryTag);
});