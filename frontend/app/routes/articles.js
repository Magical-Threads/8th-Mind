import Ember from 'ember';
import config from './../config/environment';
import ResetScrollMixin from 'ember-cli-reset-scroll';

export default Ember.Route.extend(ResetScrollMixin, {
	title: '8th Mind: Articles',
	perPage: 4,
	// queryParams: {
	// 	page: {
	// 		refreshModel: true
	// 	}
	// },
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
		let url = (params['page']) ?
			config.serverPath + 'articles/?tag=Article&per_page='+this.get('perPage')+'&page=' + params['page'] :
			config.serverPath + 'articles/?tag=Article&per_page='+this.get('perPage');

		return Ember.$.ajax({
			method: 'GET',
			url: url,
		}).then((result) => {

			let articles = result.result
			return Ember.RSVP.hash({
				articles: articles,
				pagination: result.pagination
			});

		})
	},

});
