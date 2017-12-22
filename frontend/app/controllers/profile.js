import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    submit: function() {
      console.log('@@@@ Submit user changes to server');
      this.get('model').save().then(() => {
        console.log('@@@@ Profile saved');
      }).catch((err) => {
        console.error('#### Error in saving profile', err);
      });
    }
  }
});
