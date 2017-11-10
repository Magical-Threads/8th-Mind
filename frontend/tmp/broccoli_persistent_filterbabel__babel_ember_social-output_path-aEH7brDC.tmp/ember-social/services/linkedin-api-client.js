define('ember-social/services/linkedin-api-client', ['exports', 'ember'], function (exports, _ember) {

  /* globals IN */

  var linkedinScriptPromise;

  exports['default'] = _ember['default'].Service.extend({
    /*
     * A tracking object implementing `shared(serviceName, payload)` and/or
     * `clicked(serviceName, payload)` can be set on this object, and will
     * be delegated to if present.
     */
    tracking: null, // optional injection
    load: function load() {
      if (!linkedinScriptPromise) {
        var shareHandlerName = 'linkedin_share_' + _ember['default'].guidFor(this);
        var tracking = this.tracking;
        window[shareHandlerName] = function (sharedUrl) {
          if (!tracking) {
            return;
          }
          if (tracking.shared) {
            tracking.shared('linkedin', { url: sharedUrl });
          }
        };
        linkedinScriptPromise = new _ember['default'].RSVP.Promise(function (resolve /*, reject*/) {
          _ember['default'].$.getScript("//platform.linkedin.com/in.js?async=true", function success() {
            IN.shareHandlerName = shareHandlerName;
            IN.Event.on(IN, 'systemReady', _ember['default'].run.bind(null, resolve, IN));
            IN.init();
          });
        });
      }
      return linkedinScriptPromise;
    },

    clicked: function clicked(sharedUrl) {
      var tracking = this.tracking;
      if (!tracking) {
        return;
      }
      if (tracking.clicked) {
        tracking.clicked('linkedin', { url: sharedUrl });
      }
    }
  });
});