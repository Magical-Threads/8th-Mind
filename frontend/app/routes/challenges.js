import Ember from 'ember';
import config from './../config/environment';
import ResetScrollMixin from 'ember-cli-reset-scroll';

export default Ember.Route.extend(ResetScrollMixin, {
	title: '8th Mind: Challenges',
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
			config.serverPath + 'articles/?tag=Challenge&page=' + params['page'] :
			config.serverPath + 'articles/?tag=Challenge';

		return Ember.$.ajax({
			method: "GET",
			url: url,
		}).then((result) => {

			let challengeCategories = result.result
			// .filter(categories => categories.articleTags === 'Challenge');

			return Ember.RSVP.hash({
				hasChallenges: challengeCategories.length > 0,
				articles: challengeCategories,
				pagination: result.pagination
			});

		})
	},

});
