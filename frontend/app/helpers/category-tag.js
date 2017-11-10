import Ember from 'ember';

export function categoryTag(category) {
	let firstLetterOfCategory = category[0] === undefined ? '' : category[0].split('')[0];
	return firstLetterOfCategory;
}

export default Ember.Helper.helper(categoryTag);