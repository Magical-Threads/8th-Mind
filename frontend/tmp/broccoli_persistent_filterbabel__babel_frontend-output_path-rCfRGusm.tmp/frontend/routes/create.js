define('frontend/routes/create', ['exports', 'frontend/config/environment', 'ember-cli-reset-scroll'], function (exports, _environment, _emberCliResetScroll) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Route.extend(_emberCliResetScroll.default, {
		title: '8th Mind: Create',
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
		model: function model(params) {

			var url = params['page'] ? _environment.default.serverPath + 'articles/?page=' + params['page'] : _environment.default.serverPath + 'articles/';

			return Ember.$.ajax({
				method: "GET",
				url: url
			}).then(function (result) {
				var createCategories = result.result.filter(function (categories) {
					return categories.articleTags === 'Create';
				});
				return Ember.RSVP.hash({
					articles: createCategories,
					pagination: result.pagination
				});
			});
		}

	});
});