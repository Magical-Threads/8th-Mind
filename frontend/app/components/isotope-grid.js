import Ember from 'ember';
import { TimelineMax } from 'gsap';

/* global Power1 */

export default Ember.Component.extend({
	classNames: ['gallery-posts isotope-grid'],
	didInsertElement() {

		const grid = Ember.$(`#${this.elementId}`);

		// TweenMax.set(grid.children(), {autoAlpha: 0});

		/* Initialize after images have been loaded */
		grid.imagesLoaded(event => {
			if (!event.isComplete) {
				this.get('flashMessages').info('Gallery failed to load.');
			}
			else {
				grid.isotope({
					itemSelector: '.gallery-post',
					percentPosition: true,
				})
			}
		})
		.on('layoutComplete', event => {
			// grid.find('.gallery-post').flickity({
			// 	// options
			// 	cellAlign: 'left',
			// 	contain: true
			// });
			if (event.type === 'layoutComplete') {
				new TimelineMax()
				.staggerFromTo(grid.children(), 0.6, {
					autoAlpha: 0,
					ease: Power1.easeIn
				}, {
					autoAlpha: 1, 
					ease: Power1.easeOut
				}, 0.6/grid.children.length)		
			}
		});
	}
});