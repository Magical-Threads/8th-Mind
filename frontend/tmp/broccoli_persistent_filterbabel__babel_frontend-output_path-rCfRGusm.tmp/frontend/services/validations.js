define('frontend/services/validations', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var set = Ember.set;

  exports.default = Ember.Service.extend({
    init: function init() {
      set(this, 'cache', {});
    }
  });
});