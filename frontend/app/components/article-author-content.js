import Ember from 'ember';
import config from './../config/environment';
import '../scripts/gsap.SplitText';

/* global SplitText */

function hightLightParagraph(element) {
	element.classList.add('article-hightlight');
	return new SplitText(element, {
		type: 'lines',
		linesClass: 'lines lines++'
	});
}

function wrapImages(images) {
	images.forEach(image => {
		let parent = image.parentElement;
		let figure = document.createElement('figure');
		figure.classList.add('article-figure')
		figure.appendChild(image);
		parent.appendChild(figure);
	});
}

function initSpecialStyle(context) {
	context.firstParagraph = Array.from(context.element.querySelectorAll('p'))[0];
	context.blockquotes = Array.from(context.element.querySelectorAll('blockquote p'));
	context.images = Array.from(context.element.querySelectorAll('img'));
	context.blockquotes.forEach(blockquote => hightLightParagraph(blockquote));
	wrapImages(context.images);
	return hightLightParagraph(context.firstParagraph);
}

export default Ember.Component.extend({
	serverURL: config.serverPath,
	classNames: [
		'article-author-content'
	],
	init() {
		this._super(...arguments);
	},
	didInsertElement() {
		this.hightlight = initSpecialStyle(this)
	},
	willDestroyElement() {
		this.hightlight.revert();
	}
});
