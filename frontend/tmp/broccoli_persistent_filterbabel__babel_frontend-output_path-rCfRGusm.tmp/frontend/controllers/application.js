define('frontend/controllers/application', ['exports', 'frontend/config/environment'], function (exports, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Controller.extend({
		rootUrl: _environment.default.rootURL,
		session: Ember.inject.service('session'),
		actions: {
			toggleNav: function toggleNav() {
				$('.header-collapsable-nav').toggleClass('active');
				$('.header-nav-toggle').toggleClass('active');
			},
			logout: function logout() {
				this.get('session').invalidate();
			},
			subscribe: function subscribe() {
				var _this = this;

				var _getProperties = this.getProperties('subscribeEmail'),
				    subscribeEmail = _getProperties.subscribeEmail;

				if (!subscribeEmail) {
					$('#subscribe_error').text('Email is Missing');
					$('#subscribe_error').show();
					$('#subscribe_error').fadeOut(5000);
				} else {
					Ember.$.ajax({
						method: "POST",
						url: _environment.default.serverPath + 'subscribe',
						data: {
							subscribeEmail: subscribeEmail
						}
					}).then(function (data) {
						if (data.success == false) {
							$('#subscribe_error').text(data.errors);
							$('#subscribe_error').show();
							$('#subscribe_error').fadeOut(5000);
						} else {
							$('#subscribe_success').text('Subscribe Successfully');
							$('#subscribe_success').show();
							$('#subscribe_success').fadeOut(5000);
						}
						_this.setProperties({
							subscribeEmail: ''
						});
					});
				}
			}
		}
	});
});