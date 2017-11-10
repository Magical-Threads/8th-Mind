define('frontend/routes/articles', ['exports', 'frontend/config/environment', 'ember-cli-reset-scroll'], function (exports, _environment, _emberCliResetScroll) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Route.extend(_emberCliResetScroll.default, {
		title: '8th Mind: Articles',
		queryParams: {
			page: {
				refreshModel: true
			}
		},
		resetScroll: 0,
		beforeModel: function beforeModel(transition) {
			var loginController = this.controllerFor('login');
			loginController.set('previousTransition', transition);
		},
		actions: {
			didTransition: function didTransition() {
				// console.log('didTransition', true);
				return true; // Bubble the didTransition event
			}
		},
		model: function model(params) {

			var url = params['page'] ? _environment.default.serverPath + 'articles/?page=' + params['page'] : _environment.default.serverPath + 'articles/';

			return Ember.$.ajax({
				method: 'GET',
				url: url
			}).then(function (result) {

				var articleCategories = result.result.filter(function (categories) {
					return categories.articleTags === 'Article';
				});

				return Ember.RSVP.hash({
					articles: articleCategories,
					pagination: result.pagination
				});
			});
		}

	});
});