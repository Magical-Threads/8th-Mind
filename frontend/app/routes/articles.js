import Ember from 'ember';
import config from './../config/environment';
import ResetScrollMixin from 'ember-cli-reset-scroll';

export default Ember.Route.extend(ResetScrollMixin, {
	title: '8th Mind: Articles',
	queryParams: {
		page: {
			refreshModel: true
		}
	},
	resetScroll: 0,
	beforeModel: function(transition) {
		var loginController = this.controllerFor('login');
		loginController.set('previousTransition', transition);
	},
	actions: {
		didTransition() {
			// console.log('didTransition', true);
			return true; // Bubble the didTransition event
		}
	},
	model: function(params) {

		var url = (params['page']) ?
			config.serverPath + 'articles/?page=' + params['page'] :
			config.serverPath + 'articles/';

		return Ember.$.ajax({
			method: 'GET',
			url: url,
		}).then((result) => {

			let articleCategories = result
				.result
				.filter(categories => categories.articleTags === 'Article');

			return Ember.RSVP.hash({
				articles: articleCategories,
				pagination: result.pagination
			});

		})
	},

});