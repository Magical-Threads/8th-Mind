import Ember from 'ember';
import ENV from 'frontend/config/environment'

/* global jQuery */

export default Ember.Component.extend({
	session: Ember.inject.service('session'),
	serverPath: ENV.serverPath,
	classNames: [
		'challenge-submit'
	],
	submissionTitle: null,
	assetCaption: null,
	submission: null,
	assetCaptionData: Ember.computed('assetCaption', 'submissionTitle', function() {
		return {
			caption: this.get('assetCaption'),
			title: this.get('submissionTitle'),
			type: 'Image'
		};
	}),
	assetUploadURL: Ember.computed('model.article.id', 'submission.id', function() {
		let model = this.get('model');
		let articleID = model.get('article.id');
		let submissionID = this.get('submission.id');
		let serverPath = this.get('serverPath');
		if (submissionID) {
			return serverPath+'articles/'+articleID+'/submissions/'+submissionID+'/asset/new';
		} else {
			return serverPath+'articles/'+articleID+'/submissions/new';
		}
	}),
	actions: {
		// Before performing the upload craete the submission
		async beforeUpload(store) {
			let model = this.get('model');
			// let serverPath = this.get('serverPath');
			let submissionTitle = this.get('submissionTitle');

			let rec = store.createRecord('submission', {title: submissionTitle});
			model.article.get('submissions').pushObject(rec);
			await rec.save({adapterOptions: {articleID: model.get('article.id')}})
			.then(() => {
				// Save succeeded - save the asset
				console.log('@@@@ Submision saved to id: ',rec.get('id'));
				console.log('@@@@ Asset caption data: ',this.get('assetCaptionData'))
				this.set('submission', rec);
			}).catch((err) => {
				// Save failed with error
				console.error('#### Error in save ',err);
				console.error('#### Submission errors: ',rec.get('errors').toArray());
				console.error('#### Submission isValid: ',rec.get('isValid'))
				this.set('errors', err.errors);
			});
		},
		// On upload success refresh view
		async uploadSuccess(data) {
			console.log('@@@@ Successful upload: ',data);
		},
		// On upload failure display errors
		async uploadError(err) {
			console.log('#### Erorr in upload: ',err);
		}
	}
});
