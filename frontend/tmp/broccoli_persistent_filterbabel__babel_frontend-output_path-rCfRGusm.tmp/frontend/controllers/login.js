define('frontend/controllers/login', ['exports', 'ember-validations'], function (exports, _emberValidations) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Controller.extend(_emberValidations.default, {
		showErrors: false,
		session: Ember.inject.service('session'),
		validations: {
			email: {
				presence: true
			},
			password: {
				presence: true
			}
		},
		actions: {
			login: function login() {
				var _this = this;

				var _getProperties = this.getProperties('email', 'password'),
				    email = _getProperties.email,
				    password = _getProperties.password;

				this.get("session").authenticate('authenticator:oauth2', email, password).then(function () {
					_this.get('flashMessages').success('You have signed in successfully');

					_this.setProperties({
						email: '',
						password: ''
					});

					var previousTransition = _this.get('previousTransition');
					if (previousTransition) {
						_this.set('previousTransition', null);
						previousTransition.retry();
					} else {
						// Default back to homepage
						_this.transitionToRoute('index');
						// this.transitionToPreviousRoute()
					}
				}).catch(function (reason) {
					_this.set('showErrors', true);
					_this.get('flashMessages').danger(reason.errors).add({
						timeout: 12000,
						destroyOnClick: true,
						onDestroy: function onDestroy() {
							// behavior triggered when flash is destroyed 
						}
					});
				});
			}
		},
		transitionToPreviousRoute: function transitionToPreviousRoute() {
			var previousTransition = this.get('previousTransition');
			if (previousTransition) {
				this.set('previousTransition', null);
				previousTransition.retry();
			} else {
				// Default back to homepage
				this.transitionToRoute('index');
			}
		}
	});
});