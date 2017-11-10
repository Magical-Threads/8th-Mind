define('frontend/controllers/change-password', ['exports', 'frontend/config/environment', 'ember-validations'], function (exports, _environment, _emberValidations) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend(_emberValidations.default, {
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
        length: { minimum: 8 }
      },
      newPasswordConfirmation: {
        presence: {
          message: ' Please confirm password'
        }
      }
    },
    actions: {
      change: function change() {
        var _this = this;

        var _getProperties = this.getProperties('oldPassword', 'newPassword', 'newPasswordConfirmation'),
            oldPassword = _getProperties.oldPassword,
            newPassword = _getProperties.newPassword,
            newPasswordConfirmation = _getProperties.newPasswordConfirmation;

        this.validate().then(function () {

          _this.get('session').authorize('authorizer:oauth2', function (headerName, headerValue) {
            Ember.$.ajax({
              beforeSend: function beforeSend(xhr) {
                xhr.setRequestHeader(headerName, headerValue);
              },
              method: "POST",
              url: _environment.default.serverPath + 'users/change-password/',
              data: { oldPassword: oldPassword, newPassword: newPassword, newPasswordConfirmation: newPasswordConfirmation }
            }).then(function (data) {

              if (data.success == false) {
                _this.set("showErrors", true);
                _this.get('flashMessages').danger(data.errors);
              } else {
                _this.get('flashMessages').success('Password Change Successfully');
                _this.setProperties({
                  oldPassword: '',
                  newPassword: '',
                  newPasswordConfirmation: ''
                });
                _this.transitionToRoute('change-password');
              }
            });
          });
        }).catch(function () {
          _this.set("showErrors", true);
        });
      }
    }

  });
});