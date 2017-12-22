import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
    location: config.locationType,
    rootURL: config.rootURL
});

Router.map(function() {
  this.route('login');
  this.route('register');
  this.route('change-password');
  this.route('activate');
  this.route('forget-password');
  this.route('reset-password-process');
  this.route('articles');
  this.route('create');
  this.route('challenges');
  this.route('article', { path: '/article/:articleID'}, function() {
      this.route('gallery', { path: '/gallery' });
  });
  this.route('gallery', { path: '/gallery/:articleID' }, function() {});

  this.route('profile');
});

export default Router;