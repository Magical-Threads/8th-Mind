import DS from 'ember-data';
import config from './../config/environment';

export default DS.RESTSerializer.extend({
	normalizeResponse (store, primaryModelClass, payload, id, requestType) {
		// console.log('@@@@ Normalize response: ',payload);
		if (payload.assets) {
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
		} else if (payload.asset) {
			payload = {
				asset: {
					id: 		payload.asset.articleSubmissionAssetID,
					caption: 	payload.asset.caption,
					type: 		payload.asset.assetType,
					image: 		`${config.serverPath}storage/submission/photo/${payload.asset.assetPath}`,
					assetID: 	payload.asset.articleSubmissionAssetID
				}
			}
		} else {
			return {meta:{}};
		}
		// console.log('serializer...',{store, primaryModelClass, payload, id, requestType})
		return this._super(store, primaryModelClass, payload, id, requestType);
	}
});
