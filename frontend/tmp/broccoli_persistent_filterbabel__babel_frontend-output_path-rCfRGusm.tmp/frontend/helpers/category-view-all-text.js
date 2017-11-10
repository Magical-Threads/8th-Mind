define('frontend/helpers/category-view-all-text', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.categoryViewAllText = categoryViewAllText;
	function categoryViewAllText(categories) {

		var category = categories[0] === undefined ? '' : categories[0].toLowerCase();

		var categoryText = category === 'article' ? 'View All Articles' : category === 'challenge' ? 'View All Challenges' : category === 'create' ? 'More To Create' : 'View All';

		return categoryText;
	}

	exports.default = Ember.Helper.helper(categoryViewAllText);
});