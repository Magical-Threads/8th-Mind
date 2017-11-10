import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['article-countdown-timer'],
	init() {
		this._super(...arguments);
	},
	days: 0,
	hours: 0,
	minutes: 0,
	seconds: 0,
	getTimeRemaining(expirationDate) {

		/*
			expirationDate: in ISO-8601 format (2017-10-31T00:00:00.000Z)
			Remove the last digit that is being passed in as a parameter,
			if not removed, the days properties doesn't get computed
		*/
		let endTime = expirationDate.toISOString().replace(/\D+$/gmi, '');
		let total = Date.parse(endTime) - Date.parse(new Date());
		let seconds = Math.floor( (total/1000) % 60 );
		let minutes = Math.floor( (total/1000/60) % 60 );
		let hours = Math.floor( (total/(1000 * 60 * 60)) % 24 );
		let days = Math.floor( total/(1000 * 60 * 60 * 24) );
		return { total, days, hours, minutes, seconds };
	},
	didInsertElement() {
	
		let expirationDate = this.attrs.article.value.data.dateEndVoting;

		const getTime = expirationDate => {
			let date = this.getTimeRemaining(expirationDate);
			return {
				days: date.days,
				hours: date.hours,
				minutes: date.minutes,
				seconds: date.seconds
			}
		};

		var time = getTime(expirationDate);

		this.timeInterval = setInterval(() => {
			time = getTime(expirationDate);
			this.set('days', time.days);
			this.set('hours', time.hours);
			this.set('minutes', time.minutes);
			this.set('seconds', time.seconds);
		}, 1000);

		if (time.days <= 0 && time.hours <= 0 && time.minutes <= 0 && time.seconds <= 0) {
			Ember.$(this.element).find('.post-aside-title').text('Time Has Ended')
			Ember.$(this.element).find('button').attr('disabled', true)
			clearInterval(this.timeInterval);
		}
	},
	willDestroyElement() {
		clearInterval(this.timeInterval);
	}
});