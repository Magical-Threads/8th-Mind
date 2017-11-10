define('frontend/models/asset', ['exports', 'ember-data'], function (exports, _emberData) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Model = _emberData.default.Model,
	    attr = _emberData.default.attr;
	exports.default = Model.extend({
		caption: attr('string'),
		type: attr('string'),
		image: attr('string'),
		assetID: attr('number')
	});
});