import Ember from 'ember';
import config from './../config/environment';

export default Ember.Controller.extend({
    queryParams: ['token'],
    token: null,
    filterUsers : function() {
        var token = this.get('token');
        if(token!=null)
        {
             Ember.$.ajax({
             method: "GET",
             url: config.serverPath+'users/activate/',
             data: {
                  token: token
                }            
            }).then((data)=>{
                   if(data['error'] != false) {
                        this.get('flashMessages').danger(data['error'])
                         this.transitionToRoute('login');
                    }
                    else
                    {
                        this.get('flashMessages').success('Email Verified successfully.Please Login.')
                         this.transitionToRoute('login');
                    }
               
           })
        }
       
    }.observes('token').on('init')
});
