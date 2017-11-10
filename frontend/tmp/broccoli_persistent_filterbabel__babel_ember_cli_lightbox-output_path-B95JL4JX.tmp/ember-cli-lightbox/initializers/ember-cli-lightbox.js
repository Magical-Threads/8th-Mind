define('ember-cli-lightbox/initializers/ember-cli-lightbox', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize(addonConfig /*, application */) {
    if (window.lightbox && addonConfig && addonConfig.lightboxOptions) {
      window.lightbox.option(addonConfig.lightboxOptions);
    }
  }

  exports.default = {
    name: 'ember-cli-lightbox',
    initialize: initialize
  };
});