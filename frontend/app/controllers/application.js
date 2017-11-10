import Ember from 'ember';
import config from './../config/environment';

/*global $*/

export default Ember.Controller.extend({
	rootUrl: config.rootURL,
	session: Ember.inject.service('session'),
	actions: {
		toggleNav() {
			$('.header-collapsable-nav').toggleClass('active');
			$('.header-nav-toggle').toggleClass('active');
		},
		logout() {
			this.get('session').invalidate();
		},
		subscribe() {
			let {
				subscribeEmail
			} = this.getProperties('subscribeEmail');
			if (!subscribeEmail) {
				$('#subscribe_error').text('Email is Missing');
				$('#subscribe_error').show();
				$('#subscribe_error').fadeOut(5000);
			} else {
				Ember.$.ajax({
					method: "POST",
					url: config.serverPath + 'subscribe',
					data: {
						subscribeEmail: subscribeEmail
					}
				}).then((data) => {
					if (data.success == false) {
						$('#subscribe_error').text(data.errors);
						$('#subscribe_error').show();
						$('#subscribe_error').fadeOut(5000);
					} else {
						$('#subscribe_success').text('Subscribe Successfully');
						$('#subscribe_success').show();
						$('#subscribe_success').fadeOut(5000);

					}
					this.setProperties({
						subscribeEmail: ''
					});
				})
			}

		}
	}
});