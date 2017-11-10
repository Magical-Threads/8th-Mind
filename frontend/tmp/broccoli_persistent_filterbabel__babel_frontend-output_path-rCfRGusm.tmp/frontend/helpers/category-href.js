define('frontend/helpers/category-href', ['exports'], function (exports) {
		'use strict';

		Object.defineProperty(exports, "__esModule", {
				value: true
		});
		exports.categoryHref = categoryHref;
		function categoryHref(category) {

				var categoryType = category[0] === undefined ? '' : category[0].toLowerCase();

				var categoryUrl =
				// if category is "aticle" or "challenge", pluralize it in order to generate the url
				/article/.test(categoryType) || /challenge/.test(categoryType) ? '/' + categoryType + 's' : '/' + categoryType;
				return categoryUrl;
		}

		exports.default = Ember.Helper.helper(categoryHref);
});