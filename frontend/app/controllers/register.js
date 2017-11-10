import Ember from 'ember';
import config from './../config/environment';
import EmberValidations from 'ember-validations';

export default Ember.Controller.extend(EmberValidations, {
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
		register() {
			let {
				userFirstName,
				userLastName,
				userEmail,
				password,
				subscribeCheck
			} = this.getProperties('userFirstName', 'userLastName', 'userEmail', 'password', 'subscribeCheck');
			if (!subscribeCheck) {
				subscribeCheck = false;
			}
			this.validate().then(() => {
				Ember.$.ajax({
					method: "POST",
					url: config.serverPath + 'register',
					data: {
						userFirstName: userFirstName,
						userLastName: userLastName,
						userEmail: userEmail,
						userPassword: password,
						// subscribeCheck,
						subscribeCheck
					}
				}).then((data) => {
					if (data.success == false) {
						this.set("showErrors", true)
						this.get('flashMessages').danger(data.errors);
					} else {
						this.get('flashMessages').success('You have Register successfully.Please Check Email to verify Your account')

						this.setProperties({
							userFirstName: '',
							userLastName: '',
							userEmail: '',
							password: '',
							subscribeCheck: ''
						});
						this.transitionToRoute('register');
					}
				})

			}).catch(() => {
				this.set("showErrors", true)

			})

		}
	},
	transitionToPreviousRoute() {
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