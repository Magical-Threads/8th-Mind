define('ember-validations/validators/local/format', ['exports', 'ember', 'ember-validations/validators/base', 'ember-validations/messages'], function (exports, _ember, _emberValidationsValidatorsBase, _emberValidationsMessages) {
  var get = _ember['default'].get;
  var isEmpty = _ember['default'].isEmpty;
  var set = _ember['default'].set;
  exports['default'] = _emberValidationsValidatorsBase['default'].extend({
    init: function init() {
      this._super.apply(this, arguments);
      if (this.options.constructor === RegExp) {
        set(this, 'options', { 'with': this.options });
      }

      if (this.options.message === undefined) {
        set(this, 'options.message', _emberValidationsMessages['default'].render('invalid', this.options));
      }
    },

    call: function call() {
      if (isEmpty(get(this.model, this.property))) {
        if (this.options.allowBlank === undefined) {
          this.errors.pushObject(this.options.message);
        }
      } else if (this.options['with'] && !this.options['with'].test(get(this.model, this.property))) {
        this.errors.pushObject(this.options.message);
      } else if (this.options.without && this.options.without.test(get(this.model, this.property))) {
        this.errors.pushObject(this.options.message);
      }
    }
  });
});