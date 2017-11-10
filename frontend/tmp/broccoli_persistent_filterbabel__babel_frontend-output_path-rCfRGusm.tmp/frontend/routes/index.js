define('frontend/routes/index', ['exports', 'frontend/config/environment', 'ember-cli-reset-scroll'], function (exports, _environment, _emberCliResetScroll) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Route.extend(_emberCliResetScroll.default, {
		title: 'Welcome to 8th Mind',
		resetScroll: 0,
		headData: Ember.inject.service(),
		model: function model() {
			return this.store.query('article', { 'per_page': 12 });
		},
		afterModel: function afterModel() {
			this.set('headData.title', this.get('title'));
			this.set('headData.url', _environment.default.sharable.defaults.url);
			this.set('headData.image', _environment.default.sharable.defaults.image);
			this.set('headData.description', _environment.default.sharable.defaults.description);
		}
	});
});