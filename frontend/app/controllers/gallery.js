import Ember from 'ember';
import config from './../config/environment';

export default Ember.Controller.extend({
	session: Ember.inject.service('session'),
	serverURL: config.serverPath,
	rootUrl: config.rootURL,
	queryParams:[
		'page',
	],
	page: 1,
	userSubmission: Ember.computed('session.data.authenticated', function() {
		// Locate any existing submission for the logged in user
		let auth = this.get('session.data.authenticated');
		let subs = this.get('model.article.submissions');
		if (auth && subs && subs.length > 0) {
			return subs.find(s => s.userID == auth.userID);
		}
		return null;
	}),
	actions: {
		showGallerySubmission() {
			Ember.$('#button-show-upload').hide();
			Ember.$('.challenge-submit').show();
		},
		nextPage() {
			let page = this.get('page');
			this.set('page', page + 1);
		},
		prevPage() {
			let page = this.get('page');
			this.set('page', page - 1);
		},

	}
});
