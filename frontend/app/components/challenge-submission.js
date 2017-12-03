import Ember from 'ember';
import ENV from 'frontend/config/environment'

export default Ember.Component.extend({
	sessionService: Ember.inject.service('session'),
	host: ENV.serverPath.replace(/\/$/, ''),
	classNames: [
		'challenge-submission'
	],
	upvoteCounterClass: Ember.computed('submission.upvote', function() {
		if (this.get('submission.upvote')) {
			return 'heart--like';
		} else {
			return 'heart--unlike';
		}
	}),
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
		handleUpvote(article, submission) {
			this.get('sessionService').authorize('authorizer:oauth2', (headerName, headerValue) => {
	      let headers = {};
	      headers[headerName] = headerValue;
				let url = this.get('host')+
					'/articles/'+article.id+
					'/submissions/'+submission.id+'/upvote'
				jQuery.ajax({url: url, headers: headers, dataType: 'json',
					method: (submission.get('upvote') ? 'delete' : 'post')})
				.then(() => {
					this.set('errors', []);
					submission.set('upvote', ! submission.get('upvote'));
					submission.set('votes', submission.get('votes') + (submission.get('upvote') ? 1 : -1))
				})
				.fail((err) => {
					this.set('errors', [err]);
				})
			});
		},
	},
	'data-submission-id': null,
});
