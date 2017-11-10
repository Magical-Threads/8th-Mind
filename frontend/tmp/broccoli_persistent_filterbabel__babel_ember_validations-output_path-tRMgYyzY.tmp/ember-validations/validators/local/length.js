define('ember-validations/validators/local/length', ['exports', 'ember', 'ember-validations/validators/base', 'ember-validations/messages'], function (exports, _ember, _emberValidationsValidatorsBase, _emberValidationsMessages) {
  var get = _ember['default'].get;
  var isEmpty = _ember['default'].isEmpty;
  var set = _ember['default'].set;
  exports['default'] = _emberValidationsValidatorsBase['default'].extend({
    init: function init() {
      var index = undefined;
      var key = undefined;

      this._super.apply(this, arguments);
      /*jshint expr:true*/
      if (typeof this.options === 'number') {
        set(this, 'options', { 'is': this.options });
      }

      if (this.options.messages === undefined) {
        set(this, 'options.messages', {});
      }

      for (index = 0; index < this.messageKeys().length; index++) {
        key = this.messageKeys()[index];
        if (this.options[key] !== undefined && this.options[key].constructor === String) {
          this.model.addObserver(this.options[key], this, this._validate);
        }
      }

      this.options.tokenizer = this.options.tokenizer || function (value) {
        return value.toString().split('');
      };
    },

    CHECKS: {
      'is': '==',
      'minimum': '>=',
      'maximum': '<='
    },

    MESSAGES: {
      'is': 'wrongLength',
      'minimum': 'tooShort',
      'maximum': 'tooLong'
    },

    getValue: function getValue(key) {
      if (this.options[key].constructor === String) {
        return get(this.model, this.options[key]) || 0;
      } else {
        return this.options[key];
      }
    },

    messageKeys: function messageKeys() {
      return Object.keys(this.MESSAGES);
    },

    checkKeys: function checkKeys() {
      return Object.keys(this.CHECKS);
    },

    renderMessageFor: function renderMessageFor(key) {
      var options = { count: this.getValue(key) };
      var _key = undefined;

      for (_key in this.options) {
        options[_key] = this.options[_key];
      }

      return this.options.messages[this.MESSAGES[key]] || _emberValidationsMessages['default'].render(this.MESSAGES[key], options);
    },

    renderBlankMessage: function renderBlankMessage() {
      if (this.options.is) {
        return this.renderMessageFor('is');
      } else if (this.options.minimum) {
        return this.renderMessageFor('minimum');
      }
    },

    call: function call() {
      var key = undefined;
      var comparisonResult = undefined;

      if (isEmpty(get(this.model, this.property))) {
        if (this.options.allowBlank === undefined && (this.options.is || this.options.minimum)) {
          this.errors.pushObject(this.renderBlankMessage());
        }
      } else {
        for (key in this.CHECKS) {
          if (!this.options[key]) {
            continue;
          }

          comparisonResult = this.compare(this.options.tokenizer(get(this.model, this.property)).length, this.getValue(key), this.CHECKS[key]);
          if (!comparisonResult) {
            this.errors.pushObject(this.renderMessageFor(key));
          }
        }
      }
    }
  });
});