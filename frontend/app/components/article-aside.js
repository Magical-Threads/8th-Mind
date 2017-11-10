import Ember from 'ember';
import ScrollMagic from 'scrollmagic';

function _ifMobile() {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export default Ember.Component.extend({
	tagName: 'aside',
	scrollMagic: Ember.inject.service(),
	willRender() {
		this.controller = new ScrollMagic.Controller()
		this._super(...arguments);
	},
	didInsertElement() {

		if (!_ifMobile()) {

			// Then okay to pin the aside element
			let parentElement = this.element.parentElement;
			let asideHeight = (this.element.clientHeight * 0.3);
			let duration = Math.round(parentElement.clientHeight - asideHeight);

			new ScrollMagic.Scene({
				triggerElement: this.element, 
				duration: duration,
				triggerHook: 0,
			})
			.setPin(this.element)
			.addTo(this.controller);
		}
	
	},
	willDestroyElement() {
		this.controller.destroy();
	}
});
