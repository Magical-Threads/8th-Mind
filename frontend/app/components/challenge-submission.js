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
			submission.destroyRecord({
				adapterOptions: {
					articleID: article.id,
					submissionID: submission.id},
				backgoundReload: false});
		},
		deleteAsset(article, submission, asset, store) {
			asset.destroyRecord({
				adapterOptions: {
					articleID: article.id,
					submissionID: submission.id,
					assetID: asset.id },
				backgoundReload: false});
		},
		handleUpvote() {

		},
		didInsertElement() {

		}
	},
	'data-submission-id': null,
});
