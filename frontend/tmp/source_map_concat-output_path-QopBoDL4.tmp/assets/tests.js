'use strict';

define('frontend/tests/app.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | app');

  QUnit.test('adapters/application.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'adapters/application.js should pass ESLint\n\n');
  });

  QUnit.test('adapters/article.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'adapters/article.js should pass ESLint\n\n');
  });

  QUnit.test('adapters/submission.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'adapters/submission.js should pass ESLint\n\n');
  });

  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });

  QUnit.test('authenticators/oauth2.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'authenticators/oauth2.js should pass ESLint\n\n');
  });

  QUnit.test('authorizers/oauth2.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'authorizers/oauth2.js should pass ESLint\n\n');
  });

  QUnit.test('components/article-aside.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/article-aside.js should pass ESLint\n\n');
  });

  QUnit.test('components/article-author-content.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/article-author-content.js should pass ESLint\n\n');
  });

  QUnit.test('components/article-challenges.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/article-challenges.js should pass ESLint\n\n');
  });

  QUnit.test('components/article-comments.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/article-comments.js should pass ESLint\n\n');
  });

  QUnit.test('components/article-countdown-timer.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/article-countdown-timer.js should pass ESLint\n\n');
  });

  QUnit.test('components/article-meta.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/article-meta.js should pass ESLint\n\n');
  });

  QUnit.test('components/article-post.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/article-post.js should pass ESLint\n\n');
  });

  QUnit.test('components/challenge-submission.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/challenge-submission.js should pass ESLint\n\n');
  });

  QUnit.test('components/challenge-submit.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/challenge-submit.js should pass ESLint\n\n');
  });

  QUnit.test('components/isotope-grid.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/isotope-grid.js should pass ESLint\n\n');
  });

  QUnit.test('components/light-box.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/light-box.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/activate.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/activate.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/application.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/application.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/article.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/article.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/articles.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/articles.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/challenges.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/challenges.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/change-password.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/change-password.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/create.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/create.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/forget-password.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/forget-password.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/gallery.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/gallery.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/index.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/login.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/login.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/privacy.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/privacy.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/register.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/register.js should pass ESLint\n\n');
  });

  QUnit.test('controllers/reset-password-process.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'controllers/reset-password-process.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/category-href.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/category-href.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/category-tag-class.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/category-tag-class.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/category-tag.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/category-tag.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/category-view-all-text.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/category-view-all-text.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/change-author-name.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/change-author-name.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/ember-cli-lightbox.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/ember-cli-lightbox.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/get-post-row-class.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/get-post-row-class.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/is-a-challenge.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/is-a-challenge.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/short-desc.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/short-desc.js should pass ESLint\n\n');
  });

  QUnit.test('models/article.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/article.js should pass ESLint\n\n');
  });

  QUnit.test('models/asset.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/asset.js should pass ESLint\n\n');
  });

  QUnit.test('models/submission.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/submission.js should pass ESLint\n\n');
  });

  QUnit.test('models/user.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'models/user.js should pass ESLint\n\n');
  });

  QUnit.test('resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint\n\n');
  });

  QUnit.test('router.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint\n\n');
  });

  QUnit.test('routes/activate.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/activate.js should pass ESLint\n\n');
  });

  QUnit.test('routes/application.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/application.js should pass ESLint\n\n');
  });

  QUnit.test('routes/article.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/article.js should pass ESLint\n\n');
  });

  QUnit.test('routes/article/gallery.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/article/gallery.js should pass ESLint\n\n');
  });

  QUnit.test('routes/articles.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/articles.js should pass ESLint\n\n');
  });

  QUnit.test('routes/challenges.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/challenges.js should pass ESLint\n\n');
  });

  QUnit.test('routes/change-password.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/change-password.js should pass ESLint\n\n');
  });

  QUnit.test('routes/create.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/create.js should pass ESLint\n\n');
  });

  QUnit.test('routes/forget-password.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/forget-password.js should pass ESLint\n\n');
  });

  QUnit.test('routes/gallery.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/gallery.js should pass ESLint\n\n');
  });

  QUnit.test('routes/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/index.js should pass ESLint\n\n');
  });

  QUnit.test('routes/login.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/login.js should pass ESLint\n\n');
  });

  QUnit.test('routes/privacy.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/privacy.js should pass ESLint\n\n');
  });

  QUnit.test('routes/register.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/register.js should pass ESLint\n\n');
  });

  QUnit.test('routes/reset-password-process.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/reset-password-process.js should pass ESLint\n\n');
  });

  QUnit.test('scripts/gallery-controller.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'scripts/gallery-controller.js should pass ESLint\n\n');
  });

  QUnit.test('scripts/gsap.SplitText.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'scripts/gsap.SplitText.js should pass ESLint\n\n');
  });

  QUnit.test('serializers/article.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/article.js should pass ESLint\n\n');
  });

  QUnit.test('serializers/asset.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/asset.js should pass ESLint\n\n');
  });

  QUnit.test('serializers/submission.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'serializers/submission.js should pass ESLint\n\n');
  });
});
define('frontend/tests/helpers/destroy-app', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = destroyApp;
  function destroyApp(application) {
    Ember.run(application, 'destroy');
  }
});
define('frontend/tests/helpers/ember-simple-auth', ['exports', 'ember-simple-auth/authenticators/test'], function (exports, _test) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.authenticateSession = authenticateSession;
  exports.currentSession = currentSession;
  exports.invalidateSession = invalidateSession;


  var TEST_CONTAINER_KEY = 'authenticator:test'; /* global wait */

  function ensureAuthenticator(app, container) {
    var authenticator = container.lookup(TEST_CONTAINER_KEY);
    if (!authenticator) {
      app.register(TEST_CONTAINER_KEY, _test.default);
    }
  }

  function authenticateSession(app, sessionData) {
    var container = app.__container__;

    var session = container.lookup('service:session');
    ensureAuthenticator(app, container);
    session.authenticate(TEST_CONTAINER_KEY, sessionData);
    return wait();
  }

  function currentSession(app) {
    return app.__container__.lookup('service:session');
  }

  function invalidateSession(app) {
    var session = app.__container__.lookup('service:session');
    if (session.get('isAuthenticated')) {
      session.invalidate();
    }
    return wait();
  }
});
define('frontend/tests/helpers/flash-message', ['ember-cli-flash/flash/object'], function (_object) {
  'use strict';

  _object.default.reopen({
    init: function init() {}
  });
});
define('frontend/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'frontend/tests/helpers/start-app', 'frontend/tests/helpers/destroy-app'], function (exports, _qunit, _startApp, _destroyApp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (name) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _startApp.default)();

        if (options.beforeEach) {
          return options.beforeEach.apply(this, arguments);
        }
      },
      afterEach: function afterEach() {
        var _this = this;

        var afterEach = options.afterEach && options.afterEach.apply(this, arguments);
        return resolve(afterEach).then(function () {
          return (0, _destroyApp.default)(_this.application);
        });
      }
    });
  };

  var resolve = Ember.RSVP.resolve;
});
define('frontend/tests/helpers/resolver', ['exports', 'frontend/resolver', 'frontend/config/environment'], function (exports, _resolver, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var resolver = _resolver.default.create();

  resolver.namespace = {
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix
  };

  exports.default = resolver;
});
define('frontend/tests/helpers/start-app', ['exports', 'frontend/app', 'frontend/config/environment'], function (exports, _app, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = startApp;
  function startApp(attrs) {
    var attributes = Ember.merge({}, _environment.default.APP);
    attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

    return Ember.run(function () {
      var application = _app.default.create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
      return application;
    });
  }
});
define('frontend/tests/helpers/validate-properties', ['exports', 'ember-qunit'], function (exports, _emberQunit) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.testValidPropertyValues = testValidPropertyValues;
  exports.testInvalidPropertyValues = testInvalidPropertyValues;


  var run = Ember.run;

  function validateValues(object, propertyName, values, isTestForValid) {
    var promise = null;
    var validatedValues = [];

    values.forEach(function (value) {
      function handleValidation(errors) {
        var hasErrors = object.get('errors.' + propertyName + '.firstObject');
        if (hasErrors && !isTestForValid || !hasErrors && isTestForValid) {
          validatedValues.push(value);
        }
      }

      run(object, 'set', propertyName, value);

      var objectPromise = null;
      run(function () {
        objectPromise = object.validate().then(handleValidation, handleValidation);
      });

      // Since we are setting the values in a different run loop as we are validating them,
      // we need to chain the promises so that they run sequentially. The wrong value will
      // be validated if the promises execute concurrently
      promise = promise ? promise.then(objectPromise) : objectPromise;
    });

    return promise.then(function () {
      return validatedValues;
    });
  }

  function testPropertyValues(propertyName, values, isTestForValid, context) {
    var validOrInvalid = isTestForValid ? 'Valid' : 'Invalid';
    var testName = validOrInvalid + ' ' + propertyName;

    (0, _emberQunit.test)(testName, function (assert) {
      var object = this.subject();

      if (context && typeof context === 'function') {
        context(object);
      }

      // Use QUnit.dump.parse so null and undefined can be printed as literal 'null' and
      // 'undefined' strings in the assert message.
      var valuesString = QUnit.dump.parse(values).replace(/\n(\s+)?/g, '').replace(/,/g, ', ');
      var assertMessage = 'Expected ' + propertyName + ' to have ' + validOrInvalid.toLowerCase() + ' values: ' + valuesString;

      return validateValues(object, propertyName, values, isTestForValid).then(function (validatedValues) {
        assert.deepEqual(validatedValues, values, assertMessage);
      });
    });
  }

  function testValidPropertyValues(propertyName, values, context) {
    testPropertyValues(propertyName, values, true, context);
  }

  function testInvalidPropertyValues(propertyName, values, context) {
    testPropertyValues(propertyName, values, false, context);
  }
});
define('frontend/tests/integration/components/article-aside-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('article-aside', 'Integration | Component | article aside', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "KPt1XGdQ",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"article-aside\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "5ty5iy1f",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"article-aside\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/components/article-author-content-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('article-author-content', 'Integration | Component | article author content', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "DPjn04DX",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"article-author-content\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "OuVUeqZg",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"article-author-content\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/components/article-challenges-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('article-challenges', 'Integration | Component | article challenges', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "ngTUpPqB",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"article-challenges\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "XBC+eioN",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"article-challenges\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/components/article-comments-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('article-comments', 'Integration | Component | article comments', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "4hyBSbdF",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"article-comments\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "F9OZevcQ",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"article-comments\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/components/article-countdown-timer-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('article-countdown-timer', 'Integration | Component | article countdown timer', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "X1HaH5+l",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"article-countdown-timer\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "kk7MaKUM",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"article-countdown-timer\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/components/article-main-content-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('article-main-content', 'Integration | Component | article main content', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "iWuo4kVX",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"article-main-content\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "k8YMR7dg",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"article-main-content\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/components/article-meta-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('article-meta', 'Integration | Component | article meta', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "mgr8na8j",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"article-meta\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "OzDrUv5t",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"article-meta\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/components/article-post-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('article-post', 'Integration | Component | article post', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "Gjd79IeG",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"article-post\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "esugSahS",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"article-post\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/components/challenge-submission-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('challenge-submission', 'Integration | Component | challenge submission', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "fN1XOIbY",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"challenge-submission\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "eCvpZs3y",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"challenge-submission\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/components/challenge-submit-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('challenge-submit', 'Integration | Component | challenge submit', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "+mtBE8IL",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"challenge-submit\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "f9wQnjD4",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"challenge-submit\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/components/gallery-post-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('gallery-post', 'Integration | Component | gallery post', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "0RAU9scv",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"gallery-post\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "vljSMNaj",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"gallery-post\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/components/gallery-submission-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('gallery-submission', 'Integration | Component | gallery submission', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "pvg2CnpK",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"gallery-submission\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "7R2j2ojL",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"gallery-submission\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/integration/components/isotope-grid-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('isotope-grid', 'Integration | Component | isotope grid', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "JRfvtzA/",
      "block": "{\"symbols\":[],\"statements\":[[1,[18,\"isotope-grid\"],false]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "/zfM6TW0",
      "block": "{\"symbols\":[],\"statements\":[[0,\"\\n\"],[4,\"isotope-grid\",null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"parameters\":[]},null],[0,\"  \"]],\"hasEval\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('frontend/tests/test-helper', ['frontend/tests/helpers/resolver', 'ember-qunit', 'ember-cli-qunit', 'frontend/tests/helpers/flash-message'], function (_resolver, _emberQunit, _emberCliQunit) {
  'use strict';

  (0, _emberQunit.setResolver)(_resolver.default);
  (0, _emberCliQunit.start)();
});
define('frontend/tests/tests.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | tests');

  QUnit.test('helpers/destroy-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/destroy-app.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/flash-message.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/flash-message.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/module-for-acceptance.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/module-for-acceptance.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/resolver.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/start-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/article-aside-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/article-aside-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/article-author-content-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/article-author-content-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/article-challenges-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/article-challenges-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/article-comments-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/article-comments-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/article-countdown-timer-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/article-countdown-timer-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/article-main-content-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/article-main-content-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/article-meta-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/article-meta-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/article-post-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/article-post-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/challenge-submission-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/challenge-submission-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/challenge-submit-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/challenge-submit-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/gallery-post-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/gallery-post-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/gallery-submission-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/gallery-submission-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/isotope-grid-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/isotope-grid-test.js should pass ESLint\n\n');
  });

  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });

  QUnit.test('unit/adapters/article-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/adapters/article-test.js should pass ESLint\n\n');
  });

  QUnit.test('unit/serializers/article-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/serializers/article-test.js should pass ESLint\n\n');
  });
});
define('frontend/tests/unit/adapters/article-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('adapter:article', 'Unit | Adapter | article', {
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var adapter = this.subject();
    assert.ok(adapter);
  });
});
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
require('frontend/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
