define('frontend/routes/change-password', ['exports', 'ember-simple-auth/mixins/authenticated-route-mixin'], function (exports, _authenticatedRouteMixin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend(_authenticatedRouteMixin.default, {
    title: '8th Mind: Change Your Password',
    beforeModel: function beforeModel(transition) {
      var loginController = this.controllerFor('login');
      loginController.set('previousTransition', transition);
      this._super();
    }
  });
});