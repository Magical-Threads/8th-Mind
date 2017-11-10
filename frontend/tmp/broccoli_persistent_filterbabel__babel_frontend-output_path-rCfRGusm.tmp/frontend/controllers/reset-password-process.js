define('frontend/controllers/reset-password-process', ['exports', 'frontend/config/environment', 'ember-validations'], function (exports, _environment, _emberValidations) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend(_emberValidations.default, {
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

        var _getProperties = this.getProperties('token', 'newPassword', 'newPasswordConfirmation'),
            token = _getProperties.token,
            newPassword = _getProperties.newPassword,
            newPasswordConfirmation = _getProperties.newPasswordConfirmation;

        this.validate().then(function () {

          Ember.$.ajax({
            method: "POST",
            url: _environment.default.serverPath + 'users/reset-password-process/',
            data: { token: token, newPassword: newPassword, newPasswordConfirmation: newPasswordConfirmation }
          }).then(function (data) {
            if (data.success == false) {
              _this.set("showErrors", true);
              _this.get('flashMessages').danger(data.errors);
            } else {
              _this.get('flashMessages').success('Password Reset Successfully');
              _this.setProperties({
                newPassword: '',
                newPasswordConfirmation: ''
              });
              _this.transitionToRoute('login');
            }
          });
        }).catch(function () {
          _this.set("showErrors", true);
        });
      }
    }
  });
});