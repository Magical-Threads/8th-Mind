define('frontend/models/submission', ['exports', 'ember-data'], function (exports, _emberData) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Model = _emberData.default.Model,
	    attr = _emberData.default.attr,
	    belongsTo = _emberData.default.belongsTo,
	    hasMany = _emberData.default.hasMany;
	exports.default = Model.extend({
		articleID: belongsTo('article'),
		title: attr('string'),
		name: attr('string'),
		thumb: attr('string'),
		userID: attr('number'),
		dateCreated: attr('date'),
		votes: attr('number'),
		assets: hasMany('asset')
	});
});