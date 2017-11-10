define('frontend/routes/gallery', ['exports', 'ember-cli-reset-scroll'], function (exports, _emberCliResetScroll) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Route.extend(_emberCliResetScroll.default, {
		resetScroll: 0,
		actions: {
			didTransition: function didTransition() {
				Ember.$(window).scrollTop(0);
			}
		},
		session: Ember.inject.service('session'),
		model: function model(params) {
			// /* galleryModel() is async */
			return this.store.findRecord('submission', params.articleID);
		},
		beforeModel: function beforeModel(transition) {
			var loginController = this.controllerFor('login');
			loginController.set('previousTransition', transition);
		}
	});
});