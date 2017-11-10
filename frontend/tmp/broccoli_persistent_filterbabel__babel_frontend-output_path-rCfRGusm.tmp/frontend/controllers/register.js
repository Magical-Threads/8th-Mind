define('frontend/controllers/register', ['exports', 'frontend/config/environment', 'ember-validations'], function (exports, _environment, _emberValidations) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Controller.extend(_emberValidations.default, {
		showErrors: false,
		session: Ember.inject.service('session'),
		validations: {
			userFirstName: {
				presence: true
			},
			userLastName: {
				presence: true
			},
			userEmail: {
				presence: true
			},
			password: {
				presence: {
					message: ''
				},
				length: {
					minimum: 8,
					messages: {
						tooShort: 'Password too short (Minimum 8 characters)'
					}
				}
			}
		},
		actions: {
			register: function register() {
				var _this = this;

				var _getProperties = this.getProperties('userFirstName', 'userLastName', 'userEmail', 'password', 'subscribeCheck'),
				    userFirstName = _getProperties.userFirstName,
				    userLastName = _getProperties.userLastName,
				    userEmail = _getProperties.userEmail,
				    password = _getProperties.password,
				    subscribeCheck = _getProperties.subscribeCheck;

				if (!subscribeCheck) {
					subscribeCheck = false;
				}
				this.validate().then(function () {
					Ember.$.ajax({
						method: "POST",
						url: _environment.default.serverPath + 'register',
						data: {
							userFirstName: userFirstName,
							userLastName: userLastName,
							userEmail: userEmail,
							userPassword: password,
							// subscribeCheck,
							subscribeCheck: subscribeCheck
						}
					}).then(function (data) {
						if (data.success == false) {
							_this.set("showErrors", true);
							_this.get('flashMessages').danger(data.errors);
						} else {
							_this.get('flashMessages').success('You have Register successfully.Please Check Email to verify Your account');

							_this.setProperties({
								userFirstName: '',
								userLastName: '',
								userEmail: '',
								password: '',
								subscribeCheck: ''
							});
							_this.transitionToRoute('register');
						}
					});
				}).catch(function () {
					_this.set("showErrors", true);
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