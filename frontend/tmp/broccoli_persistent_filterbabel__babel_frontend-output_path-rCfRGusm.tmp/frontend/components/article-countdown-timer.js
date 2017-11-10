define('frontend/components/article-countdown-timer', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({
		classNames: ['article-countdown-timer'],
		init: function init() {
			this._super.apply(this, arguments);
		},

		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
		getTimeRemaining: function getTimeRemaining(expirationDate) {

			/*
   	expirationDate: in ISO-8601 format (2017-10-31T00:00:00.000Z)
   	Remove the last digit that is being passed in as a parameter,
   	if not removed, the days properties doesn't get computed
   */
			var endTime = expirationDate.toISOString().replace(/\D+$/gmi, '');
			var total = Date.parse(endTime) - Date.parse(new Date());
			var seconds = Math.floor(total / 1000 % 60);
			var minutes = Math.floor(total / 1000 / 60 % 60);
			var hours = Math.floor(total / (1000 * 60 * 60) % 24);
			var days = Math.floor(total / (1000 * 60 * 60 * 24));
			return { total: total, days: days, hours: hours, minutes: minutes, seconds: seconds };
		},
		didInsertElement: function didInsertElement() {
			var _this = this;

			var expirationDate = this.attrs.article.value.data.dateEndVoting;

			var getTime = function getTime(expirationDate) {
				var date = _this.getTimeRemaining(expirationDate);
				return {
					days: date.days,
					hours: date.hours,
					minutes: date.minutes,
					seconds: date.seconds
				};
			};

			var time = getTime(expirationDate);

			this.timeInterval = setInterval(function () {
				time = getTime(expirationDate);
				_this.set('days', time.days);
				_this.set('hours', time.hours);
				_this.set('minutes', time.minutes);
				_this.set('seconds', time.seconds);
			}, 1000);

			if (time.days <= 0 && time.hours <= 0 && time.minutes <= 0 && time.seconds <= 0) {
				Ember.$(this.element).find('.post-aside-title').text('Time Has Ended');
				Ember.$(this.element).find('button').attr('disabled', true);
				clearInterval(this.timeInterval);
			}
		},
		willDestroyElement: function willDestroyElement() {
			clearInterval(this.timeInterval);
		}
	});
});