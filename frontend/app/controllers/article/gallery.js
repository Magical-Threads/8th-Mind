import Ember from 'ember';
import config from '../../config/environment';

export default Ember.Controller.extend({
	session: Ember.inject.service('session'),
	serverURL: config.serverPath,
	rootUrl: config.rootURL,
	queryParams:[
		'page',
	],
	page: 1,
	userSubmission: Ember.computed('session.data.authenticated.userID',
    'model.article.submissions.@each.isDeleted', function() {
		// Locate any existing submission for the logged in user
		let auth = this.get('session.data.authenticated.userID');
		let subs = this.get('model.article.submissions');
    // console.log('@@@@ Auth: ',auth,' subs: ',subs.map(s => s.get('userID')));
		if (auth && subs) {
      // console.log('@@@@ Sub user ids: ',subs.map(s => s.get('userID')));
			return subs.find(s => s.get('userID') === auth && !s.get('isDeleted'));
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
