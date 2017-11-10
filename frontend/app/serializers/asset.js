import DS from 'ember-data';
import config from './../config/environment';

export default DS.RESTSerializer.extend({
	normalizeResponse (store, primaryModelClass, payload, id, requestType) {

		payload = {
			assets: payload.assets.map(asset => {
				return {
					id: 		asset.articleSubmissionAssetID,
					caption: 	asset.caption,
					type: 		asset.assetType,
					image: 		`${config.serverPath}storage/submission/photo/${asset.assetPath}`,
					assetID: 	asset.articleSubmissionAssetID
				};
			})
		};
		// console.log('serializer...',{store, primaryModelClass, payload, id, requestType})
		return this._super(store, primaryModelClass, payload, id, requestType);
	}
});
