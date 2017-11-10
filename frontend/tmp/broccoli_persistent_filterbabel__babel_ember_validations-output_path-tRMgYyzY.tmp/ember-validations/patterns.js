define('ember-validations/patterns', ['exports', 'ember'], function (exports, _ember) {
  var Namespace = _ember['default'].Namespace;
  exports['default'] = Namespace.create({
    numericality: /^(-|\+)?(?:(?:(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d*)?)|(?:\.\d+))$/,
    blank: /^\s*$/
  });
});