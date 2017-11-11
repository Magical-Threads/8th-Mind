import DS from 'ember-data';
import ENV from 'frontend/config/environment'

export default DS.RESTAdapter.extend({
	host: ENV.serverPath
});
