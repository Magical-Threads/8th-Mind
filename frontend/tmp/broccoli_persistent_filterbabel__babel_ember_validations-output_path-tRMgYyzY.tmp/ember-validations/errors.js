define('ember-validations/errors', ['exports', 'ember'], function (exports, _ember) {
  var emberArray = _ember['default'].A;
  var EmberObject = _ember['default'].Object;
  var get = _ember['default'].get;
  var set = _ember['default'].set;
  exports['default'] = EmberObject.extend({
    unknownProperty: function unknownProperty(property) {
      set(this, property, emberArray());
      return get(this, property);
    }
  });
});