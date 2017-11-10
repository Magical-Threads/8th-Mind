define('frontend/helpers/ember-cli-lightbox', ['exports', 'frontend/config/environment', 'ember-cli-lightbox'], function (exports, _environment, _emberCliLightbox) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.initialize = initialize;
	// import Ember from 'ember';
	function initialize() {
		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _emberCliLightbox.default.initialize.apply(null, [_environment.default['ember-cli-lightbox']].concat(args));
	}

	exports.default = {
		name: _emberCliLightbox.default.name,
		initialize: initialize
	};
});