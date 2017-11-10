define('ember-scrollmagic/mixins/scroll-magic-route', ['exports', 'ember'], function (exports, _ember) {
  var get = _ember['default'].get;
  var service = _ember['default'].inject.service;
  exports['default'] = _ember['default'].Mixin.create({

    scrollMagic: service(),

    activate: function activate() {
      var opts = get(this, 'scrollMagicController') || {};
      get(this, 'scrollMagic').addController(get(this, 'routeName'), opts);

      this._super.apply(this, arguments);
    },

    scrollMagicController: {},

    deactivate: function deactivate() {
      this._super.apply(this, arguments);

      get(this, 'scrollMagic').destroyController(get(this, 'routeName'));
    },

    actions: {
      didTransition: function didTransition() {
        this._super.apply(this, arguments);

        get(this, 'scrollMagic').updateController();
      }
    }

  });
});