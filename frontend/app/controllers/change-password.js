import Ember from 'ember';
import config from './../config/environment';
import EmberValidations from 'ember-validations';

export default Ember.Controller.extend(EmberValidations,{
    showErrors: false,
    session: Ember.inject.service('session'),
     validations: {        
        oldPassword: {
          presence: {
           message: ' Old password required'
          }
        },
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
        
        let {oldPassword,newPassword,newPasswordConfirmation} = this.getProperties('oldPassword','newPassword','newPasswordConfirmation')
     
        this.validate().then(()=>{
            
            
            this.get('session').authorize('authorizer:oauth2', (headerName, headerValue) => {
              Ember.$.ajax({               
                beforeSend: function(xhr) {
                  xhr.setRequestHeader(headerName, headerValue);
                },
                method: "POST",
                url: config.serverPath+'users/change-password/',
                data: {oldPassword: oldPassword,newPassword: newPassword,newPasswordConfirmation: newPasswordConfirmation}
               }).then((data)=>{
                
                   if(data.success==false)
                   {
                     this.set("showErrors", true)
                     this.get('flashMessages').danger(data.errors);
                   }
                   else
                   {
                     this.get('flashMessages').success('Password Change Successfully')
                      this.setProperties({
                       oldPassword:'',
                       newPassword:'',
                       newPasswordConfirmation:''
                      });    
                     this.transitionToRoute('change-password');
                         
                   }            
              })
            });
          
       
          }).catch(()=>{
            this.set("showErrors", true)
                
          })
        
      }
    }
    
});
