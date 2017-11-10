import DS from 'ember-data';

const { Model, attr, belongsTo, hasMany } = DS;

export default Model.extend({
	articleID:			belongsTo('article'),
	title: 				attr('string'),
	name: 				attr('string'),
	thumb: 				attr('string'),
	userID: 			attr('number'),
	dateCreated: 		attr('date'),
	votes: 				attr('number'),
	assets: 			hasMany('asset'),
});
