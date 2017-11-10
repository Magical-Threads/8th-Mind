import Ember from 'ember';

export function shortDesc(params, namedArgs) {

	let str = params.toString();
	let len = parseInt(namedArgs.len);

	if (str.length > len) {
		let paragraphString = str.substring(0, len);
		let pattern = /<(\w\d|\w)>|<\/(\w\d|\w)>|&nbsp;/gmi;
		let string = paragraphString.replace(pattern, '');
		return string + '...';
	} else {
		return params;
	}
}

export default Ember.Helper.helper(shortDesc);