define('frontend/tests/unit/serializers/article-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForModel)('article', 'Unit | Serializer | article', {
    // Specify the other units that are required for this test.
    needs: ['serializer:article']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it serializes records', function (assert) {
    var record = this.subject();

    var serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });
});