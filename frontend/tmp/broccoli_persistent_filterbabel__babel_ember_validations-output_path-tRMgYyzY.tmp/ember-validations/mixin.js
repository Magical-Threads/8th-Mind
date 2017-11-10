define('ember-validations/mixin', ['exports', 'ember', 'ember-validations/errors', 'ember-validations/validators/base', 'ember-getowner-polyfill'], function (exports, _ember, _emberValidationsErrors, _emberValidationsValidatorsBase, _emberGetownerPolyfill) {
  var emberArray = _ember['default'].A;
  var ArrayProxy = _ember['default'].ArrayProxy;
  var Mixin = _ember['default'].Mixin;
  var _Ember$RSVP = _ember['default'].RSVP;
  var all = _Ember$RSVP.all;
  var reject = _Ember$RSVP.reject;
  var computed = _ember['default'].computed;
  var _Ember$computed = _ember['default'].computed;
  var alias = _Ember$computed.alias;
  var not = _Ember$computed.not;
  var get = _ember['default'].get;
  var isArray = _ember['default'].isArray;
  var isNone = _ember['default'].isNone;
  var isPresent = _ember['default'].isPresent;
  var set = _ember['default'].set;
  var warn = _ember['default'].warn;

  var setValidityMixin = Mixin.create({
    isValid: computed('validators.@each.isValid', function () {
      var compactValidators = get(this, 'validators').compact();
      var filteredValidators = compactValidators.filter(function (validator) {
        return !get(validator, 'isValid');
      });

      return get(filteredValidators, 'length') === 0;
    }),

    isInvalid: not('isValid')
  });

  var pushValidatableObject = function pushValidatableObject(model, property) {
    var content = get(model, property);

    model.removeObserver(property, pushValidatableObject);

    if (isArray(content)) {
      model.validators.pushObject(ArrayValidatorProxy.create({ model: model, property: property, contentBinding: 'model.' + property }));
    } else {
      model.validators.pushObject(content);
    }
  };

  var lookupValidator = function lookupValidator(validatorName) {
    var owner = (0, _emberGetownerPolyfill['default'])(this);
    var service = owner.lookup('service:validations');
    var validators = [];
    var cache = undefined;

    if (service) {
      cache = get(service, 'cache');
    } else {
      cache = {};
    }

    if (cache[validatorName]) {
      validators = validators.concat(cache[validatorName]);
    } else {
      var local = owner.resolveRegistration('validator:local/' + validatorName);
      var remote = owner.resolveRegistration('validator:remote/' + validatorName);

      if (local || remote) {
        validators = validators.concat([local, remote]);
      } else {
        var base = owner.resolveRegistration('validator:' + validatorName);

        if (base) {
          validators = validators.concat([base]);
        } else {
          local = owner.resolveRegistration('ember-validations@validator:local/' + validatorName);
          remote = owner.resolveRegistration('ember-validations@validator:remote/' + validatorName);

          if (local || remote) {
            validators = validators.concat([local, remote]);
          }
        }
      }

      cache[validatorName] = validators;
    }

    warn('Could not find the "' + validatorName + '" validator.', isPresent(validators), {
      id: 'ember-validations.faild-to-find-validator'
    });

    return validators;
  };

  var ArrayValidatorProxy = ArrayProxy.extend(setValidityMixin, {
    init: function init() {
      this._validate();
    },

    validate: function validate() {
      return this._validate();
    },

    _validate: function _validate() {
      var promises = get(this, 'content').invoke('_validate').without(undefined);
      return all(promises);
    },

    validators: alias('content')
  });

  exports['default'] = Mixin.create(setValidityMixin, {

    init: function init() {
      var _this = this;

      this._super.apply(this, arguments);
      this.errors = _emberValidationsErrors['default'].create();
      this.dependentValidationKeys = {};
      this.validators = emberArray();

      if (get(this, 'validations') === undefined) {
        this.validations = {};
      }

      this.buildValidators();

      this.validators.forEach(function (validator) {
        validator.addObserver('errors.[]', _this, function (sender) {
          var errors = emberArray();

          this.validators.forEach(function (validator) {
            if (validator.property === sender.property) {
              errors.addObjects(validator.errors);
            }
          });

          set(this, 'errors.' + sender.property, errors);
        });
      });

      this._validate();
    },

    buildValidators: function buildValidators() {
      var property = undefined;

      for (property in this.validations) {
        if (this.validations[property].constructor === Object) {
          this.buildRuleValidator(property);
        } else {
          this.buildObjectValidator(property);
        }
      }
    },

    buildRuleValidator: function buildRuleValidator(property) {
      var _this2 = this;

      var pushValidator = function pushValidator(validator, validatorName) {
        if (validator) {
          _this2.validators.pushObject(validator.create({ model: _this2, property: property, options: _this2.validations[property][validatorName] }));
        }
      };

      if (this.validations[property].callback) {
        this.validations[property] = { inline: this.validations[property] };
      }

      var createInlineClass = function createInlineClass(callback) {
        return _emberValidationsValidatorsBase['default'].extend({
          call: function call() {
            var errorMessage = this.callback.call(this);

            if (errorMessage) {
              this.errors.pushObject(errorMessage);
            }
          },

          callback: callback
        });
      };

      Object.keys(this.validations[property]).forEach(function (validatorName) {
        if (validatorName === 'inline') {
          var validator = createInlineClass(_this2.validations[property][validatorName].callback);
          pushValidator(validator, validatorName);
        } else if (_this2.validations[property].hasOwnProperty(validatorName)) {
          lookupValidator.call(_this2, validatorName).forEach(function (validator) {
            return pushValidator.call(_this2, validator, validatorName);
          });
        }
      });
    },

    buildObjectValidator: function buildObjectValidator(property) {
      if (isNone(get(this, property))) {
        this.addObserver(property, this, pushValidatableObject);
      } else {
        pushValidatableObject(this, property);
      }
    },

    validate: function validate() {
      var _this3 = this;

      return this._validate().then(function (vals) {
        var errors = get(_this3, 'errors');

        if (vals.indexOf(false) > -1) {
          return reject(errors);
        }

        return errors;
      });
    },

    _validate: function _validate() {
      var promises = this.validators.invoke('_validate').without(undefined);
      return all(promises);
    }
  });
});