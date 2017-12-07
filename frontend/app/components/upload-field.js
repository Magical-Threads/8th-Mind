import EmberUploader from 'ember-uploader';
import Ember from 'ember';

export default EmberUploader.FileField.extend({
  session: Ember.inject.service('session'),
  filesDidChange: function(files) {
    if (!Ember.isEmpty(files) && (files[0].size < (1024*1024))) {
      this.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
        let headers = {};
        headers[headerName] = headerValue;
        // perform pre action that is required prior to the upload
        this.get('preAction')().then(async (ok) => {
          // console.log('@@@@ Status of preAction: ',ok);
          if (ok) {
            if (files[0].size > (512*1024)) {
              this.get('error')({errors: ['Warning: Large file ('+files[0].size+') (1MB limit)']});
            }
            // peform actions prior to doing the upload
            // console.log('@@@@ Performing upload on file select with url: ',this.get('url'));
            const uploader = EmberUploader.Uploader.create({
              url: this.get('url'),
              paramName: this.get('fileParamName'),
              ajaxSettings: { headers }
            });

            // console.log('@@@@ Uploading to ',this.get('url'));
            // console.log('@@@@ Extra data: ',this.get('extraData'));

            if (!Ember.isEmpty(files)) {
              uploader.upload(files[0], this.get('extraData'))
              .then(async (data) => {
                await this.get('success')(data);
              })
              .catch(async (err) => {
                await this.get('error')(err);
              });
            } else {
              console.log('@@@@ NO files selected');
            }
          }
        });
      });
    } else if (!Ember.isEmpty(files)) {
      // console.log('@@@@ File size ',files[0].size, ' > 1024*1024',files[0].size > 1024*1024);
      this.get('error')({errors: ['File size ('+files[0].size+') too large (1MB limit)']});
    }
  }
});
