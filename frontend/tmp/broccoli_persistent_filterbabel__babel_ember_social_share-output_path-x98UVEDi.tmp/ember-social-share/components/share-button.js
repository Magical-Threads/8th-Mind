define('ember-social-share/components/share-button', ['exports', 'ember', 'ember-social-share/templates/components/share-button'], function (exports, _ember, _emberSocialShareTemplatesComponentsShareButton) {
  exports['default'] = _ember['default'].Component.extend({
    layout: _emberSocialShareTemplatesComponentsShareButton['default'],
    tagName: 'button',
    title: '',
    text: '',
    image: '',
    classNameBindings: ['adaptive:adaptive-button'],
    adaptive: true,

    getCurrentUrl: function getCurrentUrl() {
      return this.get('url') ? this.get('url') : document.location.href;
    },

    getPopupPosition: function getPopupPosition() {
      var dualScreenLeft = screen.availLeft;
      var dualScreenTop = screen.availTop;

      var windowWidth = screen.availWidth;
      var windowheight = screen.availHeight;

      var left = windowWidth / 2 - 600 / 2 + dualScreenLeft;
      var top = windowheight / 2 - 600 / 2 + dualScreenTop;

      return { left: left, top: top };
    },

    openSharePopup: function openSharePopup(url) {
      var popupPosition = this.getPopupPosition();
      var newWindow = window.open(url, 'Facebook', 'location=no,toolbar=no,menubar=no,scrollbars=no,status=no, width=600, height=600, top=' + popupPosition.top + ', left=' + popupPosition.left);

      if (typeof newWindow != 'undefined' && newWindow.focus) {
        newWindow.focus();
      }
    }
  });
});