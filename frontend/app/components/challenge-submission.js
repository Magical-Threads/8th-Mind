import Ember from 'ember';

export default Ember.Component.extend({
	classNames: [
		'challenge-submission' 
	],
	attributeBindings: [
		'data-submission-id'
	],
	actions: {
		deleteAsset(articleID, submissionID, assetID, store) {
			// console.log('deleting asset', {articleID, submissionID, assetID, store})
			store.findRecord('submission', submissionID, { backgroundReload: false })
			.then(submission => {
				// console.log({submission})
				submission.destroyRecord({ adapterOptions: { articleID, submissionID, assetID } });
			});
		},
		handleUpvote() {

		},
		didInsertElement() {
		
		}
	},
	'data-submission-id': null,
});
