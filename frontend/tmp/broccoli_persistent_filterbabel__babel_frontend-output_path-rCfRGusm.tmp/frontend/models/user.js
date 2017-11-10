define('frontend/models/user', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        userID: _emberData.default.attr('number'),
        firstName: _emberData.default.attr('string'),
        lastName: _emberData.default.attr('string'),
        email: _emberData.default.attr('string')
    });
});