import Ember from 'ember';

export default Ember.Component.extend({
	session: Ember.inject.service('session'),
	classNames: [
		'challenge-submit'
	],
	actions: {
		createSubmission() {
			
		}
	}
});
