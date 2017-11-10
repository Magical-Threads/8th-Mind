define('ember-social/components/twitter-share', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    socialApiClient: _ember['default'].inject.service('twitter-api-client'), // injected

    tagName: 'div', // set tagName to 'a' in handlebars to use your own css/content
    // instead of the standard Twitter share button UI
    useWebIntent: _ember['default'].computed.equal('tagName', 'a'),

    url: null, // Defaults to current url
    text: null, // Defaults to current page title
    via: null, // Attribute the source of a Tweet to a Twitter username.
    related: null, // A comma-separated list of accounts related to the content of the shared URI.
    hashtags: null, // A comma-separated list of hashtags to be appended to default Tweet text.

    attributeBindings: ['webIntentUrl:href'],
    webIntentUrl: _ember['default'].computed('useWebIntent', 'url', 'text', 'via', 'related', 'hashtags', function () {
      var intentUrl = 'https://twitter.com/intent/tweet',
          intentParams = [],
          params = [{ name: 'url', value: this.get('url') }, { name: 'text', value: this.get('text') }, { name: 'via', value: this.get('via') }, { name: 'related', value: this.get('related') }, { name: 'hashtags', value: this.get('hashtags') }];

      if (!this.get('useWebIntent')) {
        return;
      }

      params.forEach(function (param) {
        if (param.value) {
          intentParams.push(param.name + '=' + encodeURIComponent(param.value));
        }
      });

      return intentUrl + '?' + intentParams.join('&');
    }),

    loadTwitterClient: _ember['default'].on('didInsertElement', function () {
      var self = this;
      this.get('socialApiClient').load().then(function (twttr) {
        if (self._state !== 'inDOM') {
          return;
        }
        self.twttr = twttr;
        self.trigger('twitterLoaded');
      });
    }),

    createTwitterShareButton: _ember['default'].on('twitterLoaded', function () {
      if (this.get('useWebIntent')) {
        return;
      }
      this.twttr.widgets.createShareButton(this.get('url'), this.get('element'), {
        text: this.get('text'),
        via: this.get('via'),
        hashtags: this.get('hashtags'),
        related: this.get('related')
      }).then(function () /*el*/{
        _ember['default'].Logger.debug('Twitter Share Button created.');
      });
    })

  });
});