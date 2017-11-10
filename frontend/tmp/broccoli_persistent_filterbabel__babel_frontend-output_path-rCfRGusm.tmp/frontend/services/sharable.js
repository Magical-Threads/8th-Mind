define('frontend/services/sharable', ['exports', 'frontend/config/environment', 'ember-sharable/utils/default-meta-tags', 'ember-sharable/utils/default-link-tags'], function (exports, _environment, _defaultMetaTags, _defaultLinkTags) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed,
      Service = Ember.Service,
      inject = Ember.inject;


  var DEFAULT_CONFIG = {
    props: ['description', 'title', 'image', 'url', 'twitterHandle'],
    current: {},
    metaTagDescriptions: _defaultMetaTags.default,
    linkTagDescriptions: _defaultLinkTags.default,
    defaults: {
      ogType: 'website'
    }
  };

  function getProp(propName) {
    var currentPropKey = 'current.' + propName;
    var defaultPropKey = 'default' + propName;
    return computed(currentPropKey, defaultPropKey, function () {
      var current = this.get(currentPropKey);
      if (typeof current === 'undefined' || current === null) {
        return this.get(defaultPropKey);
      } else {
        return current;
      }
    });
  }

  function getConfigItem(key) {
    var cfg = _environment.default;
    return Ember.get(cfg, 'sharable.' + key) || Ember.get(DEFAULT_CONFIG, key);
  };

  function getDefaultProp(propName) {
    return getConfigItem('defaults.' + propName) || null;
  };

  var PROPS = getConfigItem('props');

  var serviceCfg = {
    _metaTagDescriptions: getConfigItem('metaTagDescriptions'),
    _linkTagDescriptions: getConfigItem('linkTagDescriptions'),
    _resolvedMetaTags: computed('_metaTagDescriptions.[]', 'current.' + PROPS.join(','), function () {
      var _this = this;

      return this.get('_metaTagDescriptions').map(function (desc) {
        var o = {};
        o[desc.namePropertyKey] = desc.namePropertyValue;
        var v = typeof desc.value === 'undefined' ? _this.get('_resolved' + desc.valueProperty) : desc.value;
        if (typeof v === 'undefined' || v === null) {
          return null;
        } else {
          o[desc.valuePropertyKey] = v;
          return o;
        }
      }).reduce(function (r, x) {
        if (x) {
          r.push(x);
        }
        return r;
      }, []);
    }),
    _resolvedLinkTags: computed('_linkTagDescriptions.[]', 'current.' + PROPS.join(','), function () {
      var _this2 = this;

      return this.get('_linkTagDescriptions').map(function (desc) {
        var o = {};
        o[desc.namePropertyKey] = desc.namePropertyValue;
        var v = typeof desc.value === 'undefined' ? _this2.get('_resolved' + desc.valueProperty) : desc.value;
        if (typeof v === 'undefined' || v === null) {
          return null;
        } else {
          o[desc.valuePropertyKey] = v;
          return o;
        }
      }).reduce(function (r, x) {
        if (x) {
          r.push(x);
        }
        return r;
      }, []);
    })
  };

  for (var i = 0; i < PROPS.length; i++) {
    var p = PROPS[i];
    serviceCfg['default' + p] = getDefaultProp(p);
    serviceCfg['_resolved' + p] = getProp(p);
  }

  exports.default = Service.extend(serviceCfg);
});