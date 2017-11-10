define('frontend/helpers/change-author-name', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.changeAuthorName = changeAuthorName;
	function changeAuthorName(categoryID) {
		/* 
  	Arguments are the article IDs
  */
		var thisID = categoryID[0];

		var articleIDs = categoryID.filter(function (cat, index) {
			if (index > 0) {
				return cat;
			}
		});

		var authorName = articleIDs.filter(function (id) {
			return id === thisID;
		}).map(function (articleID) {
			if (articleID === thisID) {
				return 'Tom DeSanto';
			}
		});

		return authorName.length === 0 ? '8th Mind' : authorName;
	}

	exports.default = Ember.Helper.helper(changeAuthorName);
});