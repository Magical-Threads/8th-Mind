define('frontend/components/article-aside', ['exports', 'scrollmagic'], function (exports, _scrollmagic) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});


	function _ifMobile() {
		return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
		);
	}

	exports.default = Ember.Component.extend({
		tagName: 'aside',
		scrollMagic: Ember.inject.service(),
		willRender: function willRender() {
			this.controller = new _scrollmagic.default.Controller();
			this._super.apply(this, arguments);
		},
		didInsertElement: function didInsertElement() {

			if (!_ifMobile()) {

				// Then okay to pin the aside element
				var parentElement = this.element.parentElement;
				var asideHeight = this.element.clientHeight * 0.3;
				var duration = Math.round(parentElement.clientHeight - asideHeight);

				new _scrollmagic.default.Scene({
					triggerElement: this.element,
					duration: duration,
					triggerHook: 0
				}).setPin(this.element).addTo(this.controller);
			}
		},
		willDestroyElement: function willDestroyElement() {
			this.controller.destroy();
		}
	});
});