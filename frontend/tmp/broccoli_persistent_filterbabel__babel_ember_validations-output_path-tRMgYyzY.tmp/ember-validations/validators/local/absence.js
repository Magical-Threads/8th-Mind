define('ember-validations/validators/local/absence', ['exports', 'ember', 'ember-validations/validators/base', 'ember-validations/messages'], function (exports, _ember, _emberValidationsValidatorsBase, _emberValidationsMessages) {
  var get = _ember['default'].get;
  var isPresent = _ember['default'].isPresent;
  var set = _ember['default'].set;
  exports['default'] = _emberValidationsValidatorsBase['default'].extend({
    init: function init() {
      this._super.apply(this, arguments);
      /*jshint expr:true*/
      if (this.options === true) {
        set(this, 'options', {});
      }

      if (this.options.message === undefined) {
        set(this, 'options.message', _emberValidationsMessages['default'].render('present', this.options));
      }
    },
    call: function call() {
      if (isPresent(get(this.model, this.property))) {
        this.errors.pushObject(this.options.message);
      }
    }
  });
});