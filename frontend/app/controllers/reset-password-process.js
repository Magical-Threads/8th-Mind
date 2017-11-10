import Ember from 'ember';
import config from './../config/environment';
import EmberValidations from 'ember-validations';
export default Ember.Controller.extend(EmberValidations,{
    queryParams: ['token'],
    token: null,
    showErrors: false,
    session: Ember.inject.service('session'),
     validations: {
        newPassword: {
          confirmation: true,
          presence: {
           message: ' New password required'
          },
          length:{minimum:8}
        },
       newPasswordConfirmation: {
          presence: {
            message: ' Please confirm password'
            }
          }
      },
        actions: {
      change(){
       
        let {token,newPassword,newPasswordConfirmation} = this.getProperties('token','newPassword','newPasswordConfirmation')
     
        this.validate().then(()=>{
            
              Ember.$.ajax({
                method: "POST",
                url: config.serverPath+'users/reset-password-process/',
                data: {token: token,newPassword: newPassword,newPasswordConfirmation: newPasswordConfirmation}
               }).then((data)=>{            
                   if(data.success==false)
                   {
                     this.set("showErrors", true)
                     this.get('flashMessages').danger(data.errors);
                   }
                   else
                   {
                     this.get('flashMessages').success('Password Reset Successfully')
                      this.setProperties({                       
                       newPassword:'',
                       newPasswordConfirmation:''
                      });    
                     this.transitionToRoute('login');
                         
                   }            
              }) 
       
          }).catch(()=>{
            this.set("showErrors", true)
                
          })
        
      }
    }
});
