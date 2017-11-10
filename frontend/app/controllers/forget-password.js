import Ember from 'ember';
import config from './../config/environment';
import EmberValidations from 'ember-validations';
export default Ember.Controller.extend(EmberValidations,{
    showErrors: false,
    session: Ember.inject.service('session'),
     validations: {
        email: {
          presence: true
        }       
      },
    actions: {
      forget(){
        let {email} = this.getProperties('email');
        
        this.validate().then(()=>{
            Ember.$.ajax({
            method: "POST",
            url: config.serverPath+'users/forget-password/',
            data: {email: email}
           }).then((data)=>{            
               if(data.success==false)
               {
                 this.set("showErrors", true)
                 this.get('flashMessages').danger(data.errors);
               }
               else
               {
                 this.get('flashMessages').success('Password Reset link has been send to your email')
                 this.transitionToRoute('forget-password');  
                  this.setProperties({
                   email:'',                   
                  });   
                   
               }            
          })
       
          }).catch(()=>{
            this.set("showErrors", true)
                
          })
        
        
      }
    }
   
    
    
});
