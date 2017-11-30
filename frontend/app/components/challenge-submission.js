import Ember from 'ember';

export default Ember.Component.extend({
	classNames: [
		'challenge-submission'
	],
	attributeBindings: [
		'data-submission-id'
	],
	actions: {
		deleteSubmission(article, submission, store) {
			// store.findRecord('submission', submissionID, {backgoundReload: false})
			// .then(submission => {
				// console.log('@@@@ Deleting submission: ',submission,' store: ',store);
				submission.destroyRecord({adapterOptions: {articleID: article.id, submissionID: submission.id}, backgoundReload: false});
			// })
		},
		deleteAsset(article, submission, asset, store) {
			// console.log('deleting asset', {articleID, submissionID, assetID, store})
			// store.findRecord('submission', submissionID, { backgroundReload: false })
			// .then(submission => {
				// console.log({submission})
				asset.destroyRecord({ adapterOptions: { articleID: article.id, submissionID: submission.id, assetID: asset.id }, backgoundReload: false});
			// });
		},
		handleUpvote() {

		},
		didInsertElement() {

		}
	},
	'data-submission-id': null,
});
