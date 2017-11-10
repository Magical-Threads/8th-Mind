import Ember from 'ember';
import EmberValidations from 'ember-validations';
export default Ember.Controller.extend(EmberValidations, {
	showErrors: false,
	session: Ember.inject.service('session'),
	validations: {
		email: {
			presence: true
		},
		password: {
			presence: true,
		}
	},
	actions: {
		login() {
			let {
				email,
				password
			} = this.getProperties('email', 'password');
			this.get("session").authenticate('authenticator:oauth2', email, password).then(() => {
				this.get('flashMessages').success('You have signed in successfully');

				this.setProperties({
					email: '',
					password: ''
				});

				var previousTransition = this.get('previousTransition');
				if (previousTransition) {
					this.set('previousTransition', null);
					previousTransition.retry();
				} else {
					// Default back to homepage
					this.transitionToRoute('index');
					// this.transitionToPreviousRoute()
				}

			}).catch((reason) => {
				this.set('showErrors', true);
				this.get('flashMessages').danger(reason.errors).add({
					timeout: 12000,
					destroyOnClick: true,
					onDestroy() {
						// behavior triggered when flash is destroyed 
						}
				});
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