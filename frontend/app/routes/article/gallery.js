import Ember from 'ember';
import config from './../../config/environment';
import ResetScrollMixin from 'ember-cli-reset-scroll';

export default Ember.Route.extend(ResetScrollMixin, {
	title: '8th Mind',
	resetScroll: 0,
	headData: Ember.inject.service(),
	session: Ember.inject.service('session'),
	serverURL: config.serverPath,
	rootUrl: config.rootURL,
	querParams:[
		'page',
	],
	page: 1,
	actions: {
		didTransition() {
			Ember.$(window).scrollTop(0);
		},
		showGallerySubmission() {
			Ember.$('#button-show-upload').hide();
			Ember.$('.challenge-submit').show();
		},
		nextPage() {
			let page = this.get('page');
			this.set('page', page + 1);
		},
		prevPage() {
			let page = this.get('page');
			this.set('page', page - 1);
		},
	},
	model() {
		const article = this.modelFor('article').article;
		const session = this.get('session').session.content.authenticated;
		const store = this.get('store');
		
		return { article, session, store };
	}
});

