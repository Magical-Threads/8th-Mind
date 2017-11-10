import Ember from 'ember';
import config from './../config/environment';
import ResetScrollMixin from 'ember-cli-reset-scroll';

export default Ember.Route.extend(ResetScrollMixin, {
	title: 'Welcome to 8th Mind',
	resetScroll: 0,
	headData: Ember.inject.service(),
	model() {
		return this.store.query('article', { 'per_page': 12 });
	},
	afterModel() {
		this.set('headData.title', this.get('title'));
		this.set('headData.url', config.sharable.defaults.url);
		this.set('headData.image', config.sharable.defaults.image);
		this.set('headData.description', config.sharable.defaults.description);
	}
});
