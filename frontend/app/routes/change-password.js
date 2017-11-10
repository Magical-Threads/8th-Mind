import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin,{
	title: '8th Mind: Change Your Password',
    beforeModel: function(transition) {  
      var loginController = this.controllerFor('login');
      loginController.set('previousTransition', transition); 
      this._super()     
  },
});
