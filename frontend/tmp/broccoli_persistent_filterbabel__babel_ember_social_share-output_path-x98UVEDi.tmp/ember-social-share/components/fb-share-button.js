define('ember-social-share/components/fb-share-button', ['exports', 'ember-social-share/components/share-button', 'ember-social-share/templates/components/fb-share-button'], function (exports, _emberSocialShareComponentsShareButton, _emberSocialShareTemplatesComponentsFbShareButton) {
  exports['default'] = _emberSocialShareComponentsShareButton['default'].extend({
    layout: _emberSocialShareTemplatesComponentsFbShareButton['default'],
    shareURL: 'https://facebook.com/sharer.php',
    classNames: ['fb-share-button', 'share-button'],
    click: function click() {
      var url = this.get('shareURL');
      url += '?display=popup';
      url += '&u=' + encodeURIComponent(this.getCurrentUrl());
      url += this.get('title') ? '&title=' + this.get('title') : '';
      url += this.get('image') ? '&picture=' + this.get('image') : '';
      url += this.get('text') ? '&description=' + this.get('text') : '';

      this.openSharePopup(url);
    }
  });
});