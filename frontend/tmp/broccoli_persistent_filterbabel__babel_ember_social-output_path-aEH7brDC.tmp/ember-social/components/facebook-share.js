define('ember-social/components/facebook-share', ['exports', 'ember'], function (exports, _ember) {

  /*
   * Show a button that pops up the Facebook Share dialog.
   *
   * When used with a `tagName` of `a`, it supports click tracking by
   * delegating to the socialApiClient, which can be provided with a
   * tracking object. When using without specifying a tagName, click
   * tracking is not supported due to restrictions of the Facebook SDK.
   */
  exports['default'] = _ember['default'].Component.extend({
    socialApiClient: _ember['default'].inject.service('facebook-api-client'), // injected

    tagName: 'div', // set tagName to 'a' in handlebars to use your own css/content
    // instead of the standard Facebook share button UI
    isCustomLink: _ember['default'].computed.equal('tagName', 'a'),
    useFacebookUi: _ember['default'].computed.not('isCustomLink'),

    url: null, // Defaults to current url
    "fb-layout": "icon_link", // Valid options: "box_count", "button_count", "button", "link", "icon_link", or "icon"

    createFacebookShareButton: _ember['default'].on('didInsertElement', function () {
      var self = this;
      this.get('socialApiClient').load().then(function (FB) {
        self.FB = FB;
        if (self._state !== 'inDOM') {
          return;
        }
        if (self.get('useFacebookUi')) {
          var attrs = [];
          var url = self.get('url');
          if (url) {
            attrs.push('data-href="' + url + '"');
          }
          var fbLayout = self.get('fb-layout');
          if (fbLayout) {
            attrs.push('data-layout="' + fbLayout + '"');
          }
          self.$().html('<div class="fb-share-button" ' + attrs.join(' ') + '></div>');
          FB.XFBML.parse(self.get('element'));
        } else {
          self.$().attr('href', '#');
        }
      });
    }),

    showShareDialog: _ember['default'].on('click', function (e) {
      this.get('socialApiClient').clicked({
        url: this.get('url'),
        componentName: 'facebook-share'
      });
      if (this.get('useFacebookUi')) {
        return;
      } // doesn't need a click handler
      var self = this;
      function showDialog(FB) {
        FB.ui({
          method: 'share',
          href: self.get('url')
        }, function (response) {
          if (response && !response.error_code) {
            self.get('socialApiClient').shared('facebook', response);
          } else {
            _ember['default'].Logger.error('Error while posting.');
          }
        });
      }
      if (this.FB) {
        showDialog(this.FB);
      } else {
        this.get('socialApiClient').load().then(function (FB) {
          return showDialog(FB);
        });
      }
      e.preventDefault();
    })
  });
});