define('frontend/tests/test-helper', ['frontend/tests/helpers/resolver', 'ember-qunit', 'ember-cli-qunit', 'frontend/tests/helpers/flash-message'], function (_resolver, _emberQunit, _emberCliQunit) {
  'use strict';

  (0, _emberQunit.setResolver)(_resolver.default);
  (0, _emberCliQunit.start)();
});