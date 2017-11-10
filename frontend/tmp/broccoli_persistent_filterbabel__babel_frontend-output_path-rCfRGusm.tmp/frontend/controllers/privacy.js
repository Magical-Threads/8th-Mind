define('frontend/controllers/privacy', ['exports', 'frontend/config/environment'], function (exports, _environment) {
   'use strict';

   Object.defineProperty(exports, "__esModule", {
      value: true
   });
   exports.default = Ember.Controller.extend({
      serverURL: _environment.default.serverPath
   });
});