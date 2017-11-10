import Ember from 'ember';

export function isAChallenge(boolean) {
	// Either true of false boolean
	const isChallenge = boolean[0]; 
	return isChallenge ? 'challenge' : 'article'
}

export default Ember.Helper.helper(isAChallenge);