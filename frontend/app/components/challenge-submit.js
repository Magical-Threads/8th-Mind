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
	errors: Ember.A(),
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
			console.log('@@@@ Environment: ',ENV);
			this.set('errors', Ember.A());
			let model = this.get('model');
			let submission = this.get('submission');
			// let serverPath = this.get('serverPath');
			let submissionTitle = this.get('submissionTitle') ||
				(this.get('submission.isDeleted') ? null : this.get('submission.title'));
			if (!submissionTitle || submissionTitle.length < 3) {
				// console.log('@@@@ Submission title too short: ',submissionTitle);
				this.set('errors', Ember.A(['Title must have at least 3 characters']));
				return false;
			} else if (submission != null && !submission.get('isDeleted')) {
				this.set('errors', Ember.A());
				return true;
			} else {
				let auth = this.get('session.data.authenticated');
				let rec = store.createRecord('submission', {title: submissionTitle,
					name: auth.userFirstName+' '+auth.userLastName});
				model.article.get('submissions').pushObject(rec);
				return await rec.save({adapterOptions: {articleID: model.get('article.id')}})
				.then(() => {
					// Save succeeded - save the asset
					console.log('@@@@ Submision saved to id: ',rec.get('id'));
					// console.log('@@@@ Asset caption data: ',this.get('assetCaptionData'));
					this.set('errors', Ember.A());
					this.set('submission', rec);
					return true;
				}).catch((err) => {
					// Save failed with error
					console.error('#### Error in save ',err);
					console.error('#### Submission errors: ',rec.get('errors').toArray());
					console.error('#### Submission isValid: ',rec.get('isValid'))
					this.set('errors', Ember.A(err.errors));
					return false;
				});
			}
		},
		// On upload success refresh view
		async uploadSuccess(store, data) {
			// console.log('@@@@ Successful upload: ',data,' submission: ',this.get('submission'));
			// side load asset
			let asset = data.data;
			asset.articleSubmissionAssetID = data.insertId;
			asset.id = data.insertId;
			store.push({data: {
				attributes: {
					id: 			data.insertId,
					caption: 	asset.caption,
					type: 		asset.assetType,
					image: 		`${ENV.serverPath}storage/submission/photo/${asset.assetPath}`,
					assetID: 	asset.articleSubmissionAssetID
				},
				type: 'asset',
				id: data.insertId
			}});
			let a = store.peekRecord('asset', data.insertId);
			// console.log('@@@@ Pushed ',asset,' got: ',a);
			// console.log('@@@@ SUbmission: ',this.get('submission'),' assets: ',this.get('submission.assets'));
			this.get('submission.assets').pushObject(a);
		},
		// On upload failure display errors
		async uploadError(err) {
			console.log('#### Erorr in upload: ',err, err.errors);
			this.set('errors', Ember.A(err.errors));
		}
	}
});
