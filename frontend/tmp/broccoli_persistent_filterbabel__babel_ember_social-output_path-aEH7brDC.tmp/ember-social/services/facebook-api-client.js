define('ember-social/services/facebook-api-client', ['exports', 'ember'], function (exports, _ember) {

  /* globals FB */

  var facebookScriptPromise;

  exports['default'] = _ember['default'].Service.extend({
    /*
     * A tracking object implementing `shared(serviceName, payload)` and/or
     * `clicked(serviceName, payload)` can be set on this object, and will
     * be delegated to if present. Not all Facebook
     * components support these events in all configurations.
     */
    tracking: null, // optional injection

    /*
     * This is required for certain uses of plugins, e.g. when using tagName="a"
     * for the facebook-share component.
     *
     * You can simply specify it in the handlebars when using this component, but this
     * component will also look for a global FACEBOOK_APP_ID or a meta tag of the form:
     *
     *   <meta property="fb:app_id" content="[FB_APP_ID]" />
     */
    appId: function appId() {
      return _ember['default'].$("meta[property='fb:app_id']").attr('content') || window.FACEBOOK_APP_ID;
    },

    load: function load() {
      var self = this;
      if (!facebookScriptPromise) {
        facebookScriptPromise = new _ember['default'].RSVP.Promise(function (resolve /*, reject*/) {
          if (_ember['default'].$('#fb-root').length === 0) {
            _ember['default'].$('body').append('<div id="fb-root"></div>');
          }
          window.fbAsyncInit = function () {
            FB.init({
              appId: self.appId(),
              xfbml: true,
              version: 'v2.1'
            });
            _ember['default'].run(function () {
              resolve(FB);
            });
          };

          (function (d, s, id) {
            var js,
                fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
              return;
            }
            js = d.createElement(s);js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
          })(document, 'script', 'facebook-jssdk');
        });
      }
      return facebookScriptPromise;
    },

    clicked: function clicked(payload) {
      var tracking = this.tracking;
      if (!tracking) {
        return;
      }
      if (tracking.clicked) {
        tracking.clicked('facebook', payload);
      }
    },

    shared: function shared(payload) {
      var tracking = this.tracking;
      if (!tracking) {
        return;
      }
      if (tracking.shared) {
        tracking.shared('facebook', payload);
      }
    }
  });
});