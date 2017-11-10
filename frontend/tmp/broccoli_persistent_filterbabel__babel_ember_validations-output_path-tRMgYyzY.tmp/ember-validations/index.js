define('ember-validations/index', ['exports', 'ember-validations/mixin'], function (exports, _emberValidationsMixin) {
  exports.validator = validator;
  exports['default'] = _emberValidationsMixin['default'];

  function validator(callback) {
    return { callback: callback };
  }
});