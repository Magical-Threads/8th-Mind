// import Ember from 'ember';
import config from '../config/environment';
import initializers from 'ember-cli-lightbox';

export function initialize(...args){
	return initializers.initialize.apply(null, [config['ember-cli-lightbox'], ...args]);
}

export default {
	name: initializers.name,
	initialize
};