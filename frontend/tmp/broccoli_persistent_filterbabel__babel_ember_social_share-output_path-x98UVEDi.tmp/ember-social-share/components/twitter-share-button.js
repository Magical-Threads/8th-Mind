define('ember-social-share/components/twitter-share-button', ['exports', 'ember-social-share/components/share-button', 'ember-social-share/templates/components/twitter-share-button'], function (exports, _emberSocialShareComponentsShareButton, _emberSocialShareTemplatesComponentsTwitterShareButton) {
  exports['default'] = _emberSocialShareComponentsShareButton['default'].extend({
    layout: _emberSocialShareTemplatesComponentsTwitterShareButton['default'],
    shareURL: 'https://twitter.com/intent/tweet',
    classNames: ['twitter-share-button', 'share-button'],
    hashtags: '',
    click: function click() {
      var url = this.get('shareURL');
      url += '?text=' + this.get('title');
      url += '&url=' + encodeURIComponent(this.getCurrentUrl());
      url += this.get('hashtags') ? '&hashtags=' + this.get('hashtags') : '';
      url += this.get('via') ? '&via=' + this.get('via') : '';

      this.openSharePopup(url);
    }
  });
});