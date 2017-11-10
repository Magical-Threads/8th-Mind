define('frontend/routes/application', ['exports', 'ember-simple-auth/mixins/application-route-mixin'], function (exports, _applicationRouteMixin) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Route.extend(_applicationRouteMixin.default, {
		actions: {
			didTransition: function didTransition() {
				$('.header-collapsable-nav').removeClass('active');
				$('.header-nav-toggle').removeClass('active');
			}
		}
	});
});