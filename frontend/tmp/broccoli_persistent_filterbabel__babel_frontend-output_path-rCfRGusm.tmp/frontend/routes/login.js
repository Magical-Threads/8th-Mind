define('frontend/routes/login', ['exports', 'ember-cli-reset-scroll'], function (exports, _emberCliResetScroll) {
     'use strict';

     Object.defineProperty(exports, "__esModule", {
          value: true
     });
     exports.default = Ember.Route.extend(_emberCliResetScroll.default, {
          title: '8th Mind: Login',
          resetScroll: 0
     });
});