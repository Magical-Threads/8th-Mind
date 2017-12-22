import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service('session'),
  model: function() {
    let id = this.get('session.data.authenticated.userID');
    return this.get('store').findRecord('user', id);
  }
});
