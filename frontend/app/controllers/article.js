import Ember from 'ember';
import config from './../config/environment';

export default Ember.Controller.extend({
	session: Ember.inject.service('session'),
	serverURL: config.serverPath,
	rootUrl: config.rootURL
});