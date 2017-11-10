define('frontend/routes/article', ['exports', 'frontend/config/environment', 'ember-cli-reset-scroll'], function (exports, _environment, _emberCliResetScroll) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Route.extend(_emberCliResetScroll.default, {
		title: '8th Mind',
		session: Ember.inject.service('session'),
		resetScroll: 0,
		headData: Ember.inject.service(),
		actions: {
			didTransition: function didTransition() {
				Ember.$(window).scrollTop(0); // scrollTop position for nested routes
			},
			willTransition: function willTransition() {}
		},
		beforeModel: function beforeModel(transition) {
			var loginController = this.controllerFor('login');
			loginController.set('previousTransition', transition);
		},
		setMetaData: function setMetaData(article) {

			var url = 'http://8thmind.com/article/' + article.articleID;
			var title = article.title;
			var image = _environment.default.serverPath + 'storage/articles/' + article.image;
			var concatBody = function concatBody(body) {
				var length = 140;
				var pattern = /<(\w\d|\w)>|<\/(\w\d|\w)>|&nbsp;/gmi;
				return body.substring(0, length).replace(pattern, '') + '...';
			};
			var description = concatBody(article.body);

			this.set('title', title);
			this.set('ogImage', image);
			this.set('ogUrl', url);
			this.set('ogDescription', description);

			this.set('headData.title', title);
			this.set('headData.url', url);
			this.set('headData.image', image);
			this.set('headData.description', description);
		},
		afterModel: function afterModel(model) {
			this.setMetaData(model.article.data);
		},
		model: function model(params) {

			this.set('params', params);

			var articleID = params.articleID;
			var randomPage = Math.round(Math.random() * 6);
			return Ember.RSVP.hash({
				article: this.store.findRecord('article', articleID),
				related: this.store.query('article', { page: randomPage, per_page: 3 })
			});
		},
		setupController: function setupController(controller, model) {
			controller.set('articleID', this.get('params.articleID'));
			this._super(controller, model);
		}
	});
});