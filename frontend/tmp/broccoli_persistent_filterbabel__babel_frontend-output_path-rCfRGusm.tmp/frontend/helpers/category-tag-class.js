define('frontend/helpers/category-tag-class', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.categoryTag = categoryTag;
	function categoryTag(categoryTag) {
		return categoryTag[0] === undefined ? '' : categoryTag[0].toLowerCase();
	}

	exports.default = Ember.Helper.helper(categoryTag);
});