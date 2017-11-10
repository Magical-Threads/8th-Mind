define('ember-social/components/email-share', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    tracking: null, // optional injection
    subject: '',
    body: null,
    url: '',
    bodyText: _ember['default'].computed('body', function () {
      var body = this.get('body');
      return body ? body + '\n\n' : '';
    }),
    href: _ember['default'].computed('subject', 'bodyText', 'shareUrl', function () {
      var subject = encodeURIComponent(this.get('subject'));
      var body = encodeURIComponent(this.get('bodyText') + this.get('url'));
      return "mailto:?subject=" + subject + "&body=" + body;
    }),
    tagName: 'a',
    linkTarget: '_top',
    attributeBindings: ['linkTarget:target', 'href'],
    trackClick: _ember['default'].on('click', function () {
      if (this.tracking && this.tracking.clicked) {

        this.tracking.clicked('email', {
          url: this.get('shareUrl')
        });
      }
    })
  });
});