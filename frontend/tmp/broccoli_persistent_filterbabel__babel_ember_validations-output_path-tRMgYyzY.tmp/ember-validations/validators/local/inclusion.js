define('ember-validations/validators/local/inclusion', ['exports', 'ember', 'jquery', 'ember-validations/validators/base', 'ember-validations/messages'], function (exports, _ember, _jquery, _emberValidationsValidatorsBase, _emberValidationsMessages) {
  var get = _ember['default'].get;
  var isEmpty = _ember['default'].isEmpty;
  var set = _ember['default'].set;
  var inArray = _jquery['default'].inArray;
  exports['default'] = _emberValidationsValidatorsBase['default'].extend({
    init: function init() {
      this._super.apply(this, arguments);
      if (this.options.constructor === Array) {
        set(this, 'options', { 'in': this.options });
      }

      if (this.options.message === undefined) {
        set(this, 'options.message', _emberValidationsMessages['default'].render('inclusion', this.options));
      }
    },

    call: function call() {
      var lower = undefined;
      var upper = undefined;

      if (isEmpty(get(this.model, this.property))) {
        if (this.options.allowBlank === undefined) {
          this.errors.pushObject(this.options.message);
        }
      } else if (this.options['in']) {
        if (inArray(get(this.model, this.property), this.options['in']) === -1) {
          this.errors.pushObject(this.options.message);
        }
      } else if (this.options.range) {
        lower = this.options.range[0];
        upper = this.options.range[1];

        if (get(this.model, this.property) < lower || get(this.model, this.property) > upper) {
          this.errors.pushObject(this.options.message);
        }
      }
    }
  });
});