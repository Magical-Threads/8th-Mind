define('frontend/helpers/short-desc', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.shortDesc = shortDesc;
	function shortDesc(params, namedArgs) {

		var str = params.toString();
		var len = parseInt(namedArgs.len);

		if (str.length > len) {
			var paragraphString = str.substring(0, len);
			var pattern = /<(\w\d|\w)>|<\/(\w\d|\w)>|&nbsp;/gmi;
			var string = paragraphString.replace(pattern, '');
			return string + '...';
		} else {
			return params;
		}
	}

	exports.default = Ember.Helper.helper(shortDesc);
});