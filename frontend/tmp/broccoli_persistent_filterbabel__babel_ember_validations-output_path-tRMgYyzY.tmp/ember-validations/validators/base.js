define('ember-validations/validators/base', ['exports', 'ember'], function (exports, _ember) {
  var emberArray = _ember['default'].A;
  var EmberObject = _ember['default'].Object;
  var _Ember$RSVP = _ember['default'].RSVP;
  var reject = _Ember$RSVP.reject;
  var resolve = _Ember$RSVP.resolve;
  var _Ember$computed = _ember['default'].computed;
  var empty = _Ember$computed.empty;
  var not = _Ember$computed.not;
  var get = _ember['default'].get;
  var on = _ember['default'].on;
  var set = _ember['default'].set;
  exports['default'] = EmberObject.extend({
    init: function init() {
      set(this, 'errors', emberArray());
      this.dependentValidationKeys = emberArray();
      this.conditionals = {
        'if': get(this, 'options.if'),
        unless: get(this, 'options.unless')
      };
      this.model.addObserver(this.property, this, this._validate);
    },

    addObserversForDependentValidationKeys: on('init', function () {
      this.dependentValidationKeys.forEach(function (key) {
        this.model.addObserver(key, this, this._validate);
      }, this);
    }),

    pushConditionalDependentValidationKeys: on('init', function () {
      var _this = this;

      emberArray(['if', 'unless']).forEach(function (conditionalKind) {
        var conditional = _this.conditionals[conditionalKind];
        if (typeof conditional === 'string' && typeof _this.model[conditional] !== 'function') {
          _this.dependentValidationKeys.pushObject(conditional);
        }
      });
    }),

    pushDependentValidationKeyToModel: on('init', function () {
      var model = get(this, 'model');
      if (model.dependentValidationKeys[this.property] === undefined) {
        model.dependentValidationKeys[this.property] = emberArray();
      }
      model.dependentValidationKeys[this.property].addObjects(this.dependentValidationKeys);
    }),

    call: function call() {
      throw 'Not implemented!';
    },

    unknownProperty: function unknownProperty(key) {
      var model = get(this, 'model');
      if (model) {
        return get(model, key);
      }
    },

    isValid: empty('errors.[]'),
    isInvalid: not('isValid'),

    validate: function validate() {
      var _this2 = this;

      return this._validate().then(function (success) {
        // Convert validation failures to rejects.
        var errors = get(_this2, 'model.errors');
        if (success) {
          return errors;
        } else {
          return reject(errors);
        }
      });
    },

    _validate: on('init', function () {
      this.errors.clear();
      if (this.canValidate()) {
        this.call();
      }
      if (get(this, 'isValid')) {
        return resolve(true);
      } else {
        return resolve(false);
      }
    }),

    canValidate: function canValidate() {
      if (typeof this.conditionals === 'object') {
        if (this.conditionals['if']) {
          if (typeof this.conditionals['if'] === 'function') {
            return this.conditionals['if'](this.model, this.property);
          } else if (typeof this.conditionals['if'] === 'string') {
            if (typeof this.model[this.conditionals['if']] === 'function') {
              return this.model[this.conditionals['if']]();
            } else {
              return get(this.model, this.conditionals['if']);
            }
          }
        } else if (this.conditionals.unless) {
          if (typeof this.conditionals.unless === 'function') {
            return !this.conditionals.unless(this.model, this.property);
          } else if (typeof this.conditionals.unless === 'string') {
            if (typeof this.model[this.conditionals.unless] === 'function') {
              return !this.model[this.conditionals.unless]();
            } else {
              return !get(this.model, this.conditionals.unless);
            }
          }
        } else {
          return true;
        }
      } else {
        return true;
      }
    },

    compare: function compare(a, b, operator) {
      switch (operator) {
        case '==':
          return a == b; // jshint ignore:line
        case '===':
          return a === b;
        case '>=':
          return a >= b;
        case '<=':
          return a <= b;
        case '>':
          return a > b;
        case '<':
          return a < b;
        default:
          return false;
      }
    }
  });
});