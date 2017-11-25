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
	submissionCaption: null,
	actions: {
		createSubmission(store) {
			let model = this.get('model');
			// let serverPath = this.get('serverPath');
			let submissionTitle = this.get('submissionTitle');

			let rec = store.createRecord('submission', {title: submissionTitle});
			model.article.get('submissions').pushObject(rec);
			rec.save({adapterOptions: {articleID: model.get('article').id}})
			.then(() => {
				// Save succeeded
			}).catch((err) => {
				// Save failed with error
				console.error('#### Error in save ',err);
				console.error('#### Submission errors: ',rec.get('errors').toArray());
				console.error('#### Submission isValid: ',rec.get('isValid'))
				model.set('errors', err.errors);
			})
			// let assetCaption = this.get('assetCaption');
			// let session = this.get('session');
			// let token = session.get('data').authenticated.access_token;
      //
			// console.log('@@@@ Token: ',token,' store: ',store);

			// jQuery.ajaxSetup({
			// 	beforeSend: function(xhr) {
			// 		xhr.setRequestHeader('authorization', token);
			// 	}
			// });
			// // let form = $("#add-submission");
			// // console.log('@@@@ Submitting to article ',model.article.id,' with form ',form,' action: ',form.attr('action'))
			// console.log('@@@@ New submission for article ',model.article.id,' title: ',submissionTitle,' caption: ',assetCaption);
			// // form.submit()
			// jQuery.post(serverPath+'articles/'+model.article.id+'/submissions/new', {submissionTitle})
			// .done((data) => {
			// 	console.log('@@@@ Response on submission create SUCCESS: ',data);
			// 	if (data.success) {
			// 		console.log("@@@@ Request succeeded");
			// 		store.findAll('submission');
			// 	} else {
			// 		console.log('@@@@ Request failed')
			// 	}
			// })
			// .fail((err) => {
			// 	console.log('@@@@ Response on submission create FAIL: ',err);
			// })
		}
	}
});
