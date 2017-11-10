import Ember from 'ember';

export function changeAuthorName(categoryID) {
	/* 
		Arguments are the article IDs
	*/
	let thisID = categoryID[0];

	let articleIDs = categoryID
		.filter((cat, index) => {
			if (index > 0) {
				return cat;
			}
		});

	let authorName = articleIDs
		.filter(id => (id === thisID) )
		.map(articleID => {
			if (articleID === thisID) {
				return 'Tom DeSanto';
			}
		});

	return authorName.length === 0 ? '8th Mind' : authorName;
}

export default Ember.Helper.helper(changeAuthorName);