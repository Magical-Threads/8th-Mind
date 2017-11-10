import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

/*global $*/

export default Ember.Route.extend(ApplicationRouteMixin, {
	actions: {
		didTransition() {
			$('.header-collapsable-nav').removeClass('active');
			$('.header-nav-toggle').removeClass('active');
		}
	}
});