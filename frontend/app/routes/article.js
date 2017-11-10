import Ember from 'ember';
import config from './../config/environment';
import ResetScrollMixin from 'ember-cli-reset-scroll';

export default Ember.Route.extend(ResetScrollMixin, {
	title: '8th Mind',
	session: Ember.inject.service('session'),
	resetScroll: 0,
	headData: Ember.inject.service(),
	actions: {
		didTransition() {
			Ember.$(window).scrollTop(0); // scrollTop position for nested routes
		},
		willTransition() {
		}
	},
	beforeModel(transition) {
		let loginController = this.controllerFor('login');
		loginController.set('previousTransition', transition);
	},
	setMetaData(article) {
	
		let url = `http://8thmind.com/article/${article.articleID}`;
		let title = article.title;
		let image = `${config.serverPath}storage/articles/${article.image}`;
		let concatBody = body => {
			let length = 140;
			let pattern = /<(\w\d|\w)>|<\/(\w\d|\w)>|&nbsp;/gmi;
			return body.substring(0, length).replace(pattern, '') + '...';
		};
		let description = concatBody(article.body)

		this.set('title', title);
		this.set('ogImage', image);
		this.set('ogUrl', url);
		this.set('ogDescription', description);
		
		this.set('headData.title', title);
		this.set('headData.url', url);
		this.set('headData.image', image);
		this.set('headData.description', description);
	},
	afterModel(model) {
		this.setMetaData(model.article.data);
	},
	model(params) {
		
		this.set('params', params);
		
		const articleID = params.articleID;
		const randomPage = Math.round(Math.random() * 6);
		return Ember.RSVP.hash({
			article: this.store.findRecord('article', articleID),
			related: this.store.query('article', { page: randomPage, per_page: 3 })
		});
	},
	setupController(controller, model) {
		controller.set('articleID', this.get('params.articleID'));
		this._super(controller, model);
	},
});