define('ember-social-share/components/vk-share-button', ['exports', 'ember-social-share/components/share-button', 'ember-social-share/templates/components/vk-share-button'], function (exports, _emberSocialShareComponentsShareButton, _emberSocialShareTemplatesComponentsVkShareButton) {
  exports['default'] = _emberSocialShareComponentsShareButton['default'].extend({
    layout: _emberSocialShareTemplatesComponentsVkShareButton['default'],
    shareURL: 'http://vk.com/share.php',
    classNames: ['vk-share-button', 'share-button'],
    click: function click() {
      var url = this.get('shareURL');
      url += '?url=' + encodeURIComponent(this.getCurrentUrl());
      url += this.get('title') ? '&title=' + this.get('title') : '';
      url += this.get('image') ? '&image=' + this.get('image') : '';
      url += this.get('text') ? '&description=' + this.get('text') : '';

      this.openSharePopup(url);
    }
  });
});