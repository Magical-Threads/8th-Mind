import Ember from 'ember';
import config from './../config/environment';

export default Ember.Controller.extend({
	serverURL: config.serverPath,
	rootUrl: config.rootURL,
	querParams: [
		'page',
	],
	page: 1,
	actions: {
		nextPage() {
			let page = this.get('page');
			this.set('page', page + 1);
		},
		prevPage() {
			let page = this.get('page');
			this.set('page', page - 1);
		}
	}
});