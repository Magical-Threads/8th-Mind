define('ember-social-share/components/linkedin-share-button', ['exports', 'ember-social-share/components/share-button', 'ember-social-share/templates/components/linkedin-share-button'], function (exports, _emberSocialShareComponentsShareButton, _emberSocialShareTemplatesComponentsLinkedinShareButton) {
  exports['default'] = _emberSocialShareComponentsShareButton['default'].extend({
    layout: _emberSocialShareTemplatesComponentsLinkedinShareButton['default'],
    shareURL: 'https://www.linkedin.com/shareArticle',
    classNames: ['linkedin-share-button', 'share-button'],
    hashtags: '',
    click: function click() {
      var url = this.get('shareURL');
      url += '?mini=true';
      url += '&url=' + encodeURIComponent(this.getCurrentUrl());
      url += '&title=' + this.get('title');
      url += '&summary=' + this.get('text');
      url += this.get('via') ? '&source=' + this.get('via') : '';

      this.openSharePopup(url);
    }
  });
});