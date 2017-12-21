import Ember from 'ember';
import config from './../config/environment';

export default Ember.Component.extend({
	session: Ember.inject.service('session'),
	serverURL: config.serverPath,
	classNames: [
		'article-challenge'
	],
	init() {
		this._super(...arguments);
	}
});
