import Ember from 'ember';

export function categoryViewAllText(categories) {
	
	let category = categories[0] === undefined ? '' : categories[0].toLowerCase();

	let categoryText = 
		category === 'article' ? 'View All Articles' :
		category === 'challenge' ? 'View All Challenges' : 
		category === 'create' ? 'More To Create' :
		'View All';
		
	return categoryText;
}

export default Ember.Helper.helper(categoryViewAllText);