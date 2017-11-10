import Ember from 'ember';
import config from './../config/environment';

export default Ember.Component.extend({
	serverURL: config.serverPath,
	classNames: [
		'article-comments'
	],
	init() {
		this._super(...arguments);
	}
});
