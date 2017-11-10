define('ember-scrollmagic/services/scroll-magic', ['exports', 'ember', 'scrollmagic'], function (exports, _ember, _scrollmagic) {
  var get = _ember['default'].get;
  var isEmpty = _ember['default'].isEmpty;
  var computed = _ember['default'].computed;
  var on = _ember['default'].on;
  var service = _ember['default'].inject.service;
  var debounce = _ember['default'].run.debounce;
  exports['default'] = _ember['default'].Service.extend({

    routing: service('-routing'),

    isFastBoot: computed(function () {
      return typeof FastBoot !== 'undefined';
    }),

    controllers: _ember['default'].A([]),

    addController: function addController(id, opts) {
      if (get(this, 'isFastBoot')) {
        return;
      }

      opts = opts || {};

      var register = {
        id: id,
        _controller: new _scrollmagic['default'].Controller(opts)
      };

      get(this, 'controllers').pushObject(register);

      return register.controller;
    },

    destroyController: function destroyController(id) {
      if (get(this, 'isFastBoot')) {
        return;
      }

      var controllers = get(this, 'controllers'),
          controller = this.getControllerRegistration(id);

      controller._controller.destroy();
      controllers.removeObject(controller);
    },

    getControllerRegistration: function getControllerRegistration(id) {
      var controllers = get(this, 'controllers');

      if (isEmpty(id)) {
        id = get(this, 'routing.currentPath');
      }

      var controller = controllers.findBy('id', id);
      if (isEmpty(controller)) {
        return;
      }

      return controller;
    },

    getController: function getController(id) {
      var controller = this.getControllerRegistration(id);

      if (isEmpty(controller)) {
        return;
      }

      return controller._controller;
    },

    updateController: function updateController(id) {
      if (get(this, 'isFastBoot')) {
        return;
      }

      var controller = this.getController(id);

      if (isEmpty(controller)) {
        return;
      }

      _ember['default'].run.scheduleOnce('afterRender', function () {
        controller.update();
      });
    },

    windowResize: on('init', function () {
      var _this = this;

      if (get(this, 'isFastBoot')) {
        return;
      }

      _ember['default'].$(window).bind('resize', function () {
        debounce(_this, '_updateOnResize', 150);
      });
    }),

    _updateOnResize: function _updateOnResize() {
      get(this, 'controllers').forEach(function (_ref) {
        var _controller = _ref._controller;

        _controller.update();
      });
    }

  });
});