define('ember-cli-lightbox/components/light-box', ['exports', 'ember-cli-lightbox/templates/components/light-box'], function (exports, _lightBox) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({
		layout: _lightBox.default,
		tagName: 'a',
		attributeBindings: ['href', 'data-lightbox', 'data-title', 'data-class'],
		inlineImage: true,
		classNames: ['ember-lightbox'],
		classNameBindings: ['inlineImage']
	});
});