define('ember-validations/validators/local/numericality', ['exports', 'ember', 'jquery', 'ember-validations/validators/base', 'ember-validations/messages', 'ember-validations/patterns'], function (exports, _ember, _jquery, _emberValidationsValidatorsBase, _emberValidationsMessages, _emberValidationsPatterns) {
  var get = _ember['default'].get;
  var isEmpty = _ember['default'].isEmpty;
  var inArray = _jquery['default'].inArray;
  exports['default'] = _emberValidationsValidatorsBase['default'].extend({
    init: function init() {
      /*jshint expr:true*/
      var index = undefined;
      var keys = undefined;
      var key = undefined;

      this._super.apply(this, arguments);

      if (this.options === true) {
        this.options = {};
      } else if (this.options.constructor === String) {
        key = this.options;
        this.options = {};
        this.options[key] = true;
      }

      if (this.options.messages === undefined || this.options.messages.numericality === undefined) {
        this.options.messages = this.options.messages || {};
        this.options.messages.numericality = _emberValidationsMessages['default'].render('notANumber', this.options);
      }

      if (this.options.onlyInteger !== undefined && this.options.messages.onlyInteger === undefined) {
        this.options.messages.onlyInteger = _emberValidationsMessages['default'].render('notAnInteger', this.options);
      }

      keys = Object.keys(this.CHECKS).concat(['odd', 'even']);
      for (index = 0; index < keys.length; index++) {
        key = keys[index];

        var prop = this.options[key];
        // I have no idea what the hell is going on here. This seems to do nothing.
        // The observer's key is being set to the values in the options hash?
        if (key in this.options && isNaN(prop)) {
          this.model.addObserver(prop, this, this._validate);
        }

        if (prop !== undefined && this.options.messages[key] === undefined) {
          if (inArray(key, Object.keys(this.CHECKS)) !== -1) {
            this.options.count = prop;
          }
          this.options.messages[key] = _emberValidationsMessages['default'].render(key, this.options);
          if (this.options.count !== undefined) {
            delete this.options.count;
          }
        }
      }
    },

    CHECKS: {
      equalTo: '===',
      greaterThan: '>',
      greaterThanOrEqualTo: '>=',
      lessThan: '<',
      lessThanOrEqualTo: '<='
    },

    call: function call() {
      var check = undefined;
      var checkValue = undefined;
      var comparisonResult = undefined;

      if (isEmpty(get(this.model, this.property))) {
        if (this.options.allowBlank === undefined) {
          this.errors.pushObject(this.options.messages.numericality);
        }
      } else if (!_emberValidationsPatterns['default'].numericality.test(get(this.model, this.property))) {
        this.errors.pushObject(this.options.messages.numericality);
      } else if (this.options.onlyInteger === true && !/^[+\-]?\d+$/.test(get(this.model, this.property))) {
        this.errors.pushObject(this.options.messages.onlyInteger);
      } else if (this.options.odd && parseInt(get(this.model, this.property), 10) % 2 === 0) {
        this.errors.pushObject(this.options.messages.odd);
      } else if (this.options.even && parseInt(get(this.model, this.property), 10) % 2 !== 0) {
        this.errors.pushObject(this.options.messages.even);
      } else {
        for (check in this.CHECKS) {
          if (this.options[check] === undefined) {
            continue;
          }

          if (!isNaN(parseFloat(this.options[check])) && isFinite(this.options[check])) {
            checkValue = this.options[check];
          } else if (get(this.model, this.options[check]) !== undefined) {
            checkValue = get(this.model, this.options[check]);
          }

          comparisonResult = this.compare(get(this.model, this.property), checkValue, this.CHECKS[check]);

          if (!comparisonResult) {
            this.errors.pushObject(this.options.messages[check]);
          }
        }
      }
    }
  });
});