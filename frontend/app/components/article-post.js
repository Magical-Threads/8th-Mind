import Ember from 'ember';
import config from './../config/environment';

export default Ember.Component.extend({
	serverURL: config.serverPath,
	classNames: [
		'post'
	],
	init() {
		this._super(...arguments);
	}
});
