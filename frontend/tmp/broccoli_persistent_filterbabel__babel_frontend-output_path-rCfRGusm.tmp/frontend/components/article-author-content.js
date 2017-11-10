define('frontend/components/article-author-content', ['exports', 'frontend/config/environment', 'frontend/scripts/gsap.SplitText'], function (exports, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});


	/* global SplitText */

	function hightLightParagraph(element) {
		element.classList.add('article-hightlight');
		return new SplitText(element, {
			type: 'lines',
			linesClass: 'lines lines++'
		});
	}

	function wrapImages(images) {
		images.forEach(function (image) {
			var parent = image.parentElement;
			var figure = document.createElement('figure');
			figure.classList.add('article-figure');
			figure.appendChild(image);
			parent.appendChild(figure);
		});
	}

	function initSpecialStyle(context) {
		context.firstParagraph = Array.from(context.element.querySelectorAll('p'))[0];
		context.blockquotes = Array.from(context.element.querySelectorAll('blockquote p'));
		context.images = Array.from(context.element.querySelectorAll('img'));
		context.blockquotes.forEach(function (blockquote) {
			return hightLightParagraph(blockquote);
		});
		wrapImages(context.images);
		return hightLightParagraph(context.firstParagraph);
	}

	exports.default = Ember.Component.extend({
		serverURL: _environment.default.serverPath,
		classNames: ['article-author-content'],
		init: function init() {
			this._super.apply(this, arguments);
		},
		didInsertElement: function didInsertElement() {
			this.hightlight = initSpecialStyle(this);
		},
		willDestroyElement: function willDestroyElement() {
			this.hightlight.revert();
		}
	});
});