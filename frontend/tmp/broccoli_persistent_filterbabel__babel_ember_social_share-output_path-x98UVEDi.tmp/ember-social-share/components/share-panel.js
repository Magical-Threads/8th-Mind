define('ember-social-share/components/share-panel', ['exports', 'ember', 'ember-social-share/templates/components/share-panel'], function (exports, _ember, _emberSocialShareTemplatesComponentsSharePanel) {
  exports['default'] = _ember['default'].Component.extend({
    layout: _emberSocialShareTemplatesComponentsSharePanel['default'],
    classNames: ['share-panel'],
    buttonToComponent: { 'fb': 'fb-share-button',
      'facebook': 'fb-share-button',
      'vk': 'vk-share-button',
      'vkontakte': 'vk-share-button',
      'twitter': 'twitter-share-button',
      'linkedin': 'linkedin-share-button' },
    buttons: '',
    labels: '',
    adaptive: true,

    components: _ember['default'].computed('buttons', function () {
      var _this = this;

      var buttons = this.splitData(this.get('buttons'));
      var labels = this.splitData(this.get('labels'));
      return buttons.map(function (item, index) {
        return { name: _this.get('buttonToComponent')[item], label: labels[index] };
      });
    }),

    splitData: function splitData(data) {
      return data.split(',').map(function (item) {
        return item.trim();
      });
    }
  });
});