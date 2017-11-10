define('frontend/components/challenge-submission', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({
		classNames: ['challenge-submission'],
		attributeBindings: ['data-submission-id'],
		actions: {
			deleteAsset: function deleteAsset(articleID, submissionID, assetID, store) {
				// console.log('deleting asset', {articleID, submissionID, assetID, store})
				store.findRecord('submission', submissionID, { backgroundReload: false }).then(function (submission) {
					// console.log({submission})
					submission.destroyRecord({ adapterOptions: { articleID: articleID, submissionID: submissionID, assetID: assetID } });
				});
			},
			handleUpvote: function handleUpvote() {},
			didInsertElement: function didInsertElement() {}
		},
		'data-submission-id': null
	});
});