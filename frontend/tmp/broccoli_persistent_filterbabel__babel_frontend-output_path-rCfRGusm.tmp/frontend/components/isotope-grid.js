define('frontend/components/isotope-grid', ['exports', 'gsap'], function (exports, _gsap) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({
		classNames: ['gallery-posts isotope-grid'],
		didInsertElement: function didInsertElement() {
			var _this = this;

			var grid = Ember.$('#' + this.elementId);

			// TweenMax.set(grid.children(), {autoAlpha: 0});

			/* Initialize after images have been loaded */
			grid.imagesLoaded(function (event) {
				if (!event.isComplete) {
					_this.get('flashMessages').info('Gallery failed to load.');
				} else {
					grid.isotope({
						itemSelector: '.gallery-post',
						percentPosition: true
					});
				}
			}).on('layoutComplete', function (event) {
				// grid.find('.gallery-post').flickity({
				// 	// options
				// 	cellAlign: 'left',
				// 	contain: true
				// });
				if (event.type === 'layoutComplete') {
					new _gsap.TimelineMax().staggerFromTo(grid.children(), 0.6, {
						autoAlpha: 0,
						ease: Power1.easeIn
					}, {
						autoAlpha: 1,
						ease: Power1.easeOut
					}, 0.6 / grid.children.length);
				}
			});
		}
	});
});