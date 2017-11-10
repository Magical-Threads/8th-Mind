define('frontend/routes/article/gallery', ['exports', 'frontend/config/environment', 'ember-cli-reset-scroll'], function (exports, _environment, _emberCliResetScroll) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Route.extend(_emberCliResetScroll.default, {
		title: '8th Mind',
		resetScroll: 0,
		headData: Ember.inject.service(),
		session: Ember.inject.service('session'),
		serverURL: _environment.default.serverPath,
		rootUrl: _environment.default.rootURL,
		querParams: ['page'],
		page: 1,
		actions: {
			didTransition: function didTransition() {
				Ember.$(window).scrollTop(0);
			},
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
		},
		model: function model() {
			var article = this.modelFor('article').article;
			var session = this.get('session').session.content.authenticated;
			var store = this.get('store');

			return { article: article, session: session, store: store };
		}
	});
});