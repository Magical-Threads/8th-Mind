import Ember from 'ember';
// import config from './../config/environment';
import ResetScrollMixin from 'ember-cli-reset-scroll';

export default Ember.Route.extend(ResetScrollMixin, {
	resetScroll: 0,
	actions: {
		didTransition() {
			Ember.$(window).scrollTop(0);
		}
	},
	session: Ember.inject.service('session'),
	model(params) {
		// /* galleryModel() is async */
		return this.store.findRecord('submission', params.articleID);
	},
	beforeModel(transition) {
		const loginController = this.controllerFor('login');
		loginController.set('previousTransition', transition);
	}
});