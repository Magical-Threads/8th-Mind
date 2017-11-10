define('ember-validations/validators/local/presence', ['exports', 'ember', 'ember-validations/validators/base', 'ember-validations/messages'], function (exports, _ember, _emberValidationsValidatorsBase, _emberValidationsMessages) {
  var get = _ember['default'].get;
  var isBlank = _ember['default'].isBlank;
  exports['default'] = _emberValidationsValidatorsBase['default'].extend({
    init: function init() {
      this._super.apply(this, arguments);
      /*jshint expr:true*/
      if (this.options === true) {
        this.options = {};
      }

      if (this.options.message === undefined) {
        this.options.message = _emberValidationsMessages['default'].render('blank', this.options);
      }
    },
    call: function call() {
      if (isBlank(get(this.model, this.property))) {
        this.errors.pushObject(this.options.message);
      }
    }
  });
});