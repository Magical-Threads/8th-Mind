define('frontend/controllers/activate', ['exports', 'frontend/config/environment'], function (exports, _environment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Controller.extend({
        queryParams: ['token'],
        token: null,
        filterUsers: function () {
            var _this = this;

            var token = this.get('token');
            if (token != null) {
                Ember.$.ajax({
                    method: "GET",
                    url: _environment.default.serverPath + 'users/activate/',
                    data: {
                        token: token
                    }
                }).then(function (data) {
                    if (data['error'] != false) {
                        _this.get('flashMessages').danger(data['error']);
                        _this.transitionToRoute('login');
                    } else {
                        _this.get('flashMessages').success('Email Verified successfully.Please Login.');
                        _this.transitionToRoute('login');
                    }
                });
            }
        }.observes('token').on('init')
    });
});