import DS from 'ember-data';
import ENV from 'frontend/config/environment'
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default DS.RESTAdapter.extend(DataAdapterMixin, {
	host: ENV.serverPath.replace(/\/$/, ''),
	authorizer: 'authorizer:oauth2'
});
