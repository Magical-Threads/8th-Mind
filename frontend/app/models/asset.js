import DS from 'ember-data';

const { Model, attr } = DS;

export default Model.extend({
	caption: 			attr('string'),
	type: 				attr('string'),
	image: 				attr('string'),
	assetID: 			attr('number')
});
