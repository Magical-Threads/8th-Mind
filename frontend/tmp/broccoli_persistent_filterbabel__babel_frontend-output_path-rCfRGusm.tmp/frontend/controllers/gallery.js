define('frontend/controllers/gallery', ['exports', 'frontend/config/environment'], function (exports, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Controller.extend({
		session: Ember.inject.service('session'),
		serverURL: _environment.default.serverPath,
		rootUrl: _environment.default.rootURL,
		querParams: ['page'],
		page: 1,
		actions: {
			showGallerySubmission: function showGallerySubmission() {
				Ember.$('#button-show-upload').hide();
				Ember.$('.challenge-submit').show();
			},
			nextPage: function nextPage() {
				var page = this.get('page');
				this.set('page', page + 1);
			},
			prevPage: function prevPage() {
				var page = this.get('page');
				this.set('page', page - 1);
			}
		}
	});
});