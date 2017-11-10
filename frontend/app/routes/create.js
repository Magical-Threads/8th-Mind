import Ember from 'ember';
import config from './../config/environment';
import ResetScrollMixin from 'ember-cli-reset-scroll';

export default Ember.Route.extend(ResetScrollMixin, {
	title: '8th Mind: Create',
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
	model: function(params) {

		var url = (params['page']) ?
			config.serverPath + 'articles/?page=' + params['page'] :
			config.serverPath + 'articles/';
		
		return Ember.$.ajax({
			method: "GET",
			url: url,
		}).then((result) => {
			let createCategories = result.result.filter(categories => categories.articleTags === 'Create');
			return Ember.RSVP.hash({
				articles: createCategories,
				pagination: result.pagination
			});

		})
	},

});