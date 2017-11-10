import Ember from 'ember';

export function categoryHref(category) {
	
	let categoryType = category[0] === undefined ? '' : category[0].toLowerCase();

	let categoryUrl = 
			// if category is "aticle" or "challenge", pluralize it in order to generate the url
			/article/.test(categoryType) || /challenge/.test(categoryType) ? 
			'/' + categoryType + 's' : 
			'/' + categoryType;
		return categoryUrl;	
}

export default Ember.Helper.helper(categoryHref);