import Ember from 'ember';

export function categoryTag(categoryTag) {
	return categoryTag[0] === undefined ? '' : categoryTag[0].toLowerCase();
}

export default Ember.Helper.helper(categoryTag);