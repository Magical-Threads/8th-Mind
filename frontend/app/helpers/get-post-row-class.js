import Ember from 'ember';

export function getPostRowClass(params) {
	let articles = params[0];
	return articles.length === 6 ? 'post-row-length-1' : articles.length === 7 ? 'post-row-length-2' : '';
}

export default Ember.Helper.helper(getPostRowClass);