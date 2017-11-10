define('ember-social/components/social-widget', ['exports', 'ember', 'ember-social/templates/components/social-widget'], function (exports, _ember, _emberSocialTemplatesComponentsSocialWidget) {
  exports['default'] = _ember['default'].Component.extend({
    classNames: ['social-widget'],
    layout: _emberSocialTemplatesComponentsSocialWidget['default'],

    url: null,

    like: true,

    share: true,

    facebook: true,

    twitter: true,

    linkedin: true,

    email: true,

    emailLinkText: 'Share via email',

    emailBody: 'Hope you enjoy it!',

    emailSubject: 'Check Out This Link',

    facebookLike: _ember['default'].computed.and('like', 'facebook'),

    facebookShare: _ember['default'].computed.and('share', 'facebook'),

    twitterShare: _ember['default'].computed.and('share', 'twitter'),

    linkedinShare: _ember['default'].computed.and('share', 'linkedin'),

    emailShare: _ember['default'].computed.and('share', 'email', 'url')
  });
});