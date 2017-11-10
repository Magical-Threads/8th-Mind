define('frontend/controllers/forget-password', ['exports', 'frontend/config/environment', 'ember-validations'], function (exports, _environment, _emberValidations) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend(_emberValidations.default, {
    showErrors: false,
    session: Ember.inject.service('session'),
    validations: {
      email: {
        presence: true
      }
    },
    actions: {
      forget: function forget() {
        var _this = this;

        var _getProperties = this.getProperties('email'),
            email = _getProperties.email;

        this.validate().then(function () {
          Ember.$.ajax({
            method: "POST",
            url: _environment.default.serverPath + 'users/forget-password/',
            data: { email: email }
          }).then(function (data) {
            if (data.success == false) {
              _this.set("showErrors", true);
              _this.get('flashMessages').danger(data.errors);
            } else {
              _this.get('flashMessages').success('Password Reset link has been send to your email');
              _this.transitionToRoute('forget-password');
              _this.setProperties({
                email: ''
              });
            }
          });
        }).catch(function () {
          _this.set("showErrors", true);
        });
      }
    }

  });
});