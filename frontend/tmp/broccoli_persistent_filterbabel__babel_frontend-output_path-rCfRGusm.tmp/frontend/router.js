define('frontend/router', ['exports', 'frontend/config/environment'], function (exports, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});


	var Router = Ember.Router.extend({
		location: _environment.default.locationType,
		rootURL: _environment.default.rootURL
	});

	Router.map(function () {
		this.route('login');
		this.route('register');
		this.route('change-password');
		this.route('activate');
		this.route('forget-password');
		this.route('reset-password-process');
		this.route('articles');
		this.route('create');
		this.route('challenges');
		this.route('article', { path: '/article/:articleID' }, function () {
			this.route('gallery', { path: '/gallery' });
		});
		this.route('gallery', { path: '/gallery/:articleID' }, function () {});
	});

	exports.default = Router;
});