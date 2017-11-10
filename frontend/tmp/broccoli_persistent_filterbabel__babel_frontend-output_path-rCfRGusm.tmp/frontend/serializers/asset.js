define('frontend/serializers/asset', ['exports', 'ember-data', 'frontend/config/environment'], function (exports, _emberData, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = _emberData.default.RESTSerializer.extend({
		normalizeResponse: function normalizeResponse(store, primaryModelClass, payload, id, requestType) {

			payload = {
				assets: payload.assets.map(function (asset) {
					return {
						id: asset.articleSubmissionAssetID,
						caption: asset.caption,
						type: asset.assetType,
						image: _environment.default.serverPath + 'storage/submission/photo/' + asset.assetPath,
						assetID: asset.articleSubmissionAssetID
					};
				})
			};
			// console.log('serializer...',{store, primaryModelClass, payload, id, requestType})
			return this._super(store, primaryModelClass, payload, id, requestType);
		}
	});
});