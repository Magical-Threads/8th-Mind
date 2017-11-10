"use strict";



define('frontend/adapters/application', ['exports', 'ember-data'], function (exports, _emberData) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = _emberData.default.RESTAdapter.extend({
		host: 'http://api.8thmind.com'
	});
});
define('frontend/adapters/article', ['exports', 'frontend/adapters/application'], function (exports, _application) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = _application.default.extend({
		buildURL: function buildURL(modelName, id, snapshot, requestType, query) {
			if (requestType === 'findRecord') {
				return this.host + '/' + modelName + 's/detail/' + id;
			} else if (requestType === 'findAll') {
				return this.host + '/' + modelName + 's/';
			} else if (requestType === 'query') {
				return this.host + '/' + modelName + 's/';
			} else {
				return new Error('Configure your adapter for the requestType.', modelName, id, snapshot, requestType, query);
			}
		},
		pathForType: function pathForType() {
			return 'articles';
		}
	});
});
define('frontend/adapters/submission', ['exports', 'frontend/adapters/application'], function (exports, _application) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = _application.default.extend({
		buildURL: function buildURL(modelName, id, snapshot, requestType, query) {

			// console.log('submission apdapter',{modelName, id, snapshot, requestType, query})

			if (requestType === 'findRecord') {
				return this.host + '/articles/' + id + '/submissions/';
			} else if (requestType === 'peekRecord') {
				return this.host + '/articles/' + id + '/submissions/';
			} else if (requestType === 'deleteRecord') {

				var articleID = snapshot.adapterOptions.articleID;
				var submissionID = snapshot.adapterOptions.submissionID;
				var assetID = snapshot.adapterOptions.assetID;
				var url = this.host + '/articles/' + articleID + '/submissions/' + submissionID + '/asset/' + assetID;

				// console.log('deleting...', url);

				return url;
			} else {
				return new Error('Check submission adapter to support a new requestType.', 'adapter/submission.js', modelName, id, snapshot, requestType, query);
			}
		}
	}
	// handleResponse(a, b, c) {
	// 	console.log(a,b,c)

	// }
	);
});
define('frontend/app', ['exports', 'frontend/resolver', 'ember-load-initializers', 'frontend/config/environment'], function (exports, _resolver, _emberLoadInitializers, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});


	var App = Ember.Application.extend({
		modulePrefix: _environment.default.modulePrefix,
		podModulePrefix: _environment.default.podModulePrefix,
		Resolver: _resolver.default
	});

	(0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);

	exports.default = App;
});
define('frontend/authenticators/oauth2', ['exports', 'ember-simple-auth/authenticators/oauth2-password-grant', 'frontend/config/environment'], function (exports, _oauth2PasswordGrant, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _oauth2PasswordGrant.default.extend({
    serverTokenEndpoint: _environment.default.serverPath + 'login'
  });
});
define('frontend/authorizers/oauth2', ['exports', 'ember-simple-auth/authorizers/oauth2-bearer'], function (exports, _oauth2Bearer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _oauth2Bearer.default.extend();
});
define('frontend/components/article-aside', ['exports', 'scrollmagic'], function (exports, _scrollmagic) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});


	function _ifMobile() {
		return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
		);
	}

	exports.default = Ember.Component.extend({
		tagName: 'aside',
		scrollMagic: Ember.inject.service(),
		willRender: function willRender() {
			this.controller = new _scrollmagic.default.Controller();
			this._super.apply(this, arguments);
		},
		didInsertElement: function didInsertElement() {

			if (!_ifMobile()) {

				// Then okay to pin the aside element
				var parentElement = this.element.parentElement;
				var asideHeight = this.element.clientHeight * 0.3;
				var duration = Math.round(parentElement.clientHeight - asideHeight);

				new _scrollmagic.default.Scene({
					triggerElement: this.element,
					duration: duration,
					triggerHook: 0
				}).setPin(this.element).addTo(this.controller);
			}
		},
		willDestroyElement: function willDestroyElement() {
			this.controller.destroy();
		}
	});
});
define('frontend/components/article-author-content', ['exports', 'frontend/config/environment', 'frontend/scripts/gsap.SplitText'], function (exports, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});


	/* global SplitText */

	function hightLightParagraph(element) {
		element.classList.add('article-hightlight');
		return new SplitText(element, {
			type: 'lines',
			linesClass: 'lines lines++'
		});
	}

	function wrapImages(images) {
		images.forEach(function (image) {
			var parent = image.parentElement;
			var figure = document.createElement('figure');
			figure.classList.add('article-figure');
			figure.appendChild(image);
			parent.appendChild(figure);
		});
	}

	function initSpecialStyle(context) {
		context.firstParagraph = Array.from(context.element.querySelectorAll('p'))[0];
		context.blockquotes = Array.from(context.element.querySelectorAll('blockquote p'));
		context.images = Array.from(context.element.querySelectorAll('img'));
		context.blockquotes.forEach(function (blockquote) {
			return hightLightParagraph(blockquote);
		});
		wrapImages(context.images);
		return hightLightParagraph(context.firstParagraph);
	}

	exports.default = Ember.Component.extend({
		serverURL: _environment.default.serverPath,
		classNames: ['article-author-content'],
		init: function init() {
			this._super.apply(this, arguments);
		},
		didInsertElement: function didInsertElement() {
			this.hightlight = initSpecialStyle(this);
		},
		willDestroyElement: function willDestroyElement() {
			this.hightlight.revert();
		}
	});
});
define('frontend/components/article-challenges', ['exports', 'frontend/config/environment'], function (exports, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({
		serverURL: _environment.default.serverPath,
		classNames: ['article-challenge'],
		init: function init() {
			this._super.apply(this, arguments);
		}
	});
});
define('frontend/components/article-comments', ['exports', 'frontend/config/environment'], function (exports, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({
		serverURL: _environment.default.serverPath,
		classNames: ['article-comments'],
		init: function init() {
			this._super.apply(this, arguments);
		}
	});
});
define('frontend/components/article-countdown-timer', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({
		classNames: ['article-countdown-timer'],
		init: function init() {
			this._super.apply(this, arguments);
		},

		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
		getTimeRemaining: function getTimeRemaining(expirationDate) {

			/*
   	expirationDate: in ISO-8601 format (2017-10-31T00:00:00.000Z)
   	Remove the last digit that is being passed in as a parameter,
   	if not removed, the days properties doesn't get computed
   */
			var endTime = expirationDate.toISOString().replace(/\D+$/gmi, '');
			var total = Date.parse(endTime) - Date.parse(new Date());
			var seconds = Math.floor(total / 1000 % 60);
			var minutes = Math.floor(total / 1000 / 60 % 60);
			var hours = Math.floor(total / (1000 * 60 * 60) % 24);
			var days = Math.floor(total / (1000 * 60 * 60 * 24));
			return { total: total, days: days, hours: hours, minutes: minutes, seconds: seconds };
		},
		didInsertElement: function didInsertElement() {
			var _this = this;

			var expirationDate = this.attrs.article.value.data.dateEndVoting;

			var getTime = function getTime(expirationDate) {
				var date = _this.getTimeRemaining(expirationDate);
				return {
					days: date.days,
					hours: date.hours,
					minutes: date.minutes,
					seconds: date.seconds
				};
			};

			var time = getTime(expirationDate);

			this.timeInterval = setInterval(function () {
				time = getTime(expirationDate);
				_this.set('days', time.days);
				_this.set('hours', time.hours);
				_this.set('minutes', time.minutes);
				_this.set('seconds', time.seconds);
			}, 1000);

			if (time.days <= 0 && time.hours <= 0 && time.minutes <= 0 && time.seconds <= 0) {
				Ember.$(this.element).find('.post-aside-title').text('Time Has Ended');
				Ember.$(this.element).find('button').attr('disabled', true);
				clearInterval(this.timeInterval);
			}
		},
		willDestroyElement: function willDestroyElement() {
			clearInterval(this.timeInterval);
		}
	});
});
define('frontend/components/article-meta', ['exports', 'frontend/config/environment'], function (exports, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({
		serverURL: _environment.default.serverPath,
		classNames: ['article-meta'],
		init: function init() {
			this._super.apply(this, arguments);
		}
	});
});
define('frontend/components/article-post', ['exports', 'frontend/config/environment'], function (exports, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({
		serverURL: _environment.default.serverPath,
		classNames: ['post'],
		init: function init() {
			this._super.apply(this, arguments);
		}
	});
});
define('frontend/components/challenge-submission', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({
		classNames: ['challenge-submission'],
		attributeBindings: ['data-submission-id'],
		actions: {
			deleteAsset: function deleteAsset(articleID, submissionID, assetID, store) {
				// console.log('deleting asset', {articleID, submissionID, assetID, store})
				store.findRecord('submission', submissionID, { backgroundReload: false }).then(function (submission) {
					// console.log({submission})
					submission.destroyRecord({ adapterOptions: { articleID: articleID, submissionID: submissionID, assetID: assetID } });
				});
			},
			handleUpvote: function handleUpvote() {},
			didInsertElement: function didInsertElement() {}
		},
		'data-submission-id': null
	});
});
define('frontend/components/challenge-submit', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({
		session: Ember.inject.service('session'),
		classNames: ['challenge-submit'],
		actions: {
			createSubmission: function createSubmission() {}
		}
	});
});
define('frontend/components/email-share', ['exports', 'ember-social/components/email-share'], function (exports, _emailShare) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emailShare.default;
});
define('frontend/components/facebook-like', ['exports', 'ember-social/components/facebook-like'], function (exports, _facebookLike) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _facebookLike.default;
});
define('frontend/components/facebook-share', ['exports', 'ember-social/components/facebook-share'], function (exports, _facebookShare) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _facebookShare.default;
});
define('frontend/components/fb-share-button', ['exports', 'ember-social-share/components/fb-share-button'], function (exports, _fbShareButton) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _fbShareButton.default;
    }
  });
});
define('frontend/components/flash-message', ['exports', 'ember-cli-flash/components/flash-message'], function (exports, _flashMessage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _flashMessage.default;
    }
  });
});
define('frontend/components/head-content', ['exports', 'frontend/templates/head'], function (exports, _head) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    tagName: '',
    model: Ember.inject.service('head-data'),
    layout: _head.default
  });
});
define('frontend/components/head-layout', ['exports', 'ember-cli-head/templates/components/head-layout'], function (exports, _headLayout) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    tagName: '',
    layout: _headLayout.default
  });
});
define('frontend/components/head-tag', ['exports', 'ember-cli-meta-tags/components/head-tag'], function (exports, _headTag) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _headTag.default;
    }
  });
});
define('frontend/components/head-tags', ['exports', 'ember-cli-meta-tags/components/head-tags'], function (exports, _headTags) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _headTags.default;
    }
  });
});
define('frontend/components/isotope-grid', ['exports', 'gsap'], function (exports, _gsap) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({
		classNames: ['gallery-posts isotope-grid'],
		didInsertElement: function didInsertElement() {
			var _this = this;

			var grid = Ember.$('#' + this.elementId);

			// TweenMax.set(grid.children(), {autoAlpha: 0});

			/* Initialize after images have been loaded */
			grid.imagesLoaded(function (event) {
				if (!event.isComplete) {
					_this.get('flashMessages').info('Gallery failed to load.');
				} else {
					grid.isotope({
						itemSelector: '.gallery-post',
						percentPosition: true
					});
				}
			}).on('layoutComplete', function (event) {
				// grid.find('.gallery-post').flickity({
				// 	// options
				// 	cellAlign: 'left',
				// 	contain: true
				// });
				if (event.type === 'layoutComplete') {
					new _gsap.TimelineMax().staggerFromTo(grid.children(), 0.6, {
						autoAlpha: 0,
						ease: Power1.easeIn
					}, {
						autoAlpha: 1,
						ease: Power1.easeOut
					}, 0.6 / grid.children.length);
				}
			});
		}
	});
});
define('frontend/components/light-box', ['exports', 'ember-cli-lightbox/components/light-box'], function (exports, _lightBox) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _lightBox.default;
    }
  });
});
define('frontend/components/linkedin-share-button', ['exports', 'ember-social-share/components/linkedin-share-button'], function (exports, _linkedinShareButton) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _linkedinShareButton.default;
    }
  });
});
define('frontend/components/linkedin-share', ['exports', 'ember-social/components/linkedin-share'], function (exports, _linkedinShare) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _linkedinShare.default;
});
define('frontend/components/share-panel', ['exports', 'ember-social-share/components/share-panel'], function (exports, _sharePanel) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _sharePanel.default;
    }
  });
});
define('frontend/components/social-widget', ['exports', 'ember-social/components/social-widget'], function (exports, _socialWidget) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _socialWidget.default;
    }
  });
});
define('frontend/components/twitter-card', ['exports', 'ember-social/components/twitter-card'], function (exports, _twitterCard) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _twitterCard.default;
});
define('frontend/components/twitter-share-button', ['exports', 'ember-social-share/components/twitter-share-button'], function (exports, _twitterShareButton) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _twitterShareButton.default;
    }
  });
});
define('frontend/components/twitter-share', ['exports', 'ember-social/components/twitter-share'], function (exports, _twitterShare) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _twitterShare.default;
});
define('frontend/components/vk-share-button', ['exports', 'ember-social-share/components/vk-share-button'], function (exports, _vkShareButton) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _vkShareButton.default;
    }
  });
});
define('frontend/components/welcome-page', ['exports', 'ember-welcome-page/components/welcome-page'], function (exports, _welcomePage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _welcomePage.default;
    }
  });
});
define('frontend/controllers/activate', ['exports', 'frontend/config/environment'], function (exports, _environment) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Controller.extend({
        queryParams: ['token'],
        token: null,
        filterUsers: function () {
            var _this = this;

            var token = this.get('token');
            if (token != null) {
                Ember.$.ajax({
                    method: "GET",
                    url: _environment.default.serverPath + 'users/activate/',
                    data: {
                        token: token
                    }
                }).then(function (data) {
                    if (data['error'] != false) {
                        _this.get('flashMessages').danger(data['error']);
                        _this.transitionToRoute('login');
                    } else {
                        _this.get('flashMessages').success('Email Verified successfully.Please Login.');
                        _this.transitionToRoute('login');
                    }
                });
            }
        }.observes('token').on('init')
    });
});
define('frontend/controllers/application', ['exports', 'frontend/config/environment'], function (exports, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Controller.extend({
		rootUrl: _environment.default.rootURL,
		session: Ember.inject.service('session'),
		actions: {
			toggleNav: function toggleNav() {
				$('.header-collapsable-nav').toggleClass('active');
				$('.header-nav-toggle').toggleClass('active');
			},
			logout: function logout() {
				this.get('session').invalidate();
			},
			subscribe: function subscribe() {
				var _this = this;

				var _getProperties = this.getProperties('subscribeEmail'),
				    subscribeEmail = _getProperties.subscribeEmail;

				if (!subscribeEmail) {
					$('#subscribe_error').text('Email is Missing');
					$('#subscribe_error').show();
					$('#subscribe_error').fadeOut(5000);
				} else {
					Ember.$.ajax({
						method: "POST",
						url: _environment.default.serverPath + 'subscribe',
						data: {
							subscribeEmail: subscribeEmail
						}
					}).then(function (data) {
						if (data.success == false) {
							$('#subscribe_error').text(data.errors);
							$('#subscribe_error').show();
							$('#subscribe_error').fadeOut(5000);
						} else {
							$('#subscribe_success').text('Subscribe Successfully');
							$('#subscribe_success').show();
							$('#subscribe_success').fadeOut(5000);
						}
						_this.setProperties({
							subscribeEmail: ''
						});
					});
				}
			}
		}
	});
});
define('frontend/controllers/article', ['exports', 'frontend/config/environment'], function (exports, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Controller.extend({
		session: Ember.inject.service('session'),
		serverURL: _environment.default.serverPath,
		rootUrl: _environment.default.rootURL
	});
});
define('frontend/controllers/articles', ['exports', 'frontend/config/environment'], function (exports, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Controller.extend({
		serverURL: _environment.default.serverPath,
		rootUrl: _environment.default.rootURL,
		querParams: ['page'],
		page: 1,
		actions: {
			nextPage: function nextPage() {
				var page = this.get('page');
				this.set('page', page + 1);
			},
			prevPage: function prevPage() {
				var page = this.get('page');
				this.set('page', page - 1);
			}
		}
	});
});
define('frontend/controllers/challenges', ['exports', 'frontend/config/environment'], function (exports, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Controller.extend({
		serverURL: _environment.default.serverPath,
		rootUrl: _environment.default.rootURL,
		querParams: ['page'],
		page: 1,
		actions: {
			nextPage: function nextPage() {

				var page = this.get('page');

				this.set('page', page + 1);
			},
			prevPage: function prevPage() {
				var page = this.get('page');
				this.set('page', page - 1);
			}
		}
	});
});
define('frontend/controllers/change-password', ['exports', 'frontend/config/environment', 'ember-validations'], function (exports, _environment, _emberValidations) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend(_emberValidations.default, {
    showErrors: false,
    session: Ember.inject.service('session'),
    validations: {
      oldPassword: {
        presence: {
          message: ' Old password required'
        }
      },
      newPassword: {
        confirmation: true,
        presence: {
          message: ' New password required'
        },
        length: { minimum: 8 }
      },
      newPasswordConfirmation: {
        presence: {
          message: ' Please confirm password'
        }
      }
    },
    actions: {
      change: function change() {
        var _this = this;

        var _getProperties = this.getProperties('oldPassword', 'newPassword', 'newPasswordConfirmation'),
            oldPassword = _getProperties.oldPassword,
            newPassword = _getProperties.newPassword,
            newPasswordConfirmation = _getProperties.newPasswordConfirmation;

        this.validate().then(function () {

          _this.get('session').authorize('authorizer:oauth2', function (headerName, headerValue) {
            Ember.$.ajax({
              beforeSend: function beforeSend(xhr) {
                xhr.setRequestHeader(headerName, headerValue);
              },
              method: "POST",
              url: _environment.default.serverPath + 'users/change-password/',
              data: { oldPassword: oldPassword, newPassword: newPassword, newPasswordConfirmation: newPasswordConfirmation }
            }).then(function (data) {

              if (data.success == false) {
                _this.set("showErrors", true);
                _this.get('flashMessages').danger(data.errors);
              } else {
                _this.get('flashMessages').success('Password Change Successfully');
                _this.setProperties({
                  oldPassword: '',
                  newPassword: '',
                  newPasswordConfirmation: ''
                });
                _this.transitionToRoute('change-password');
              }
            });
          });
        }).catch(function () {
          _this.set("showErrors", true);
        });
      }
    }

  });
});
define('frontend/controllers/create', ['exports', 'frontend/config/environment'], function (exports, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Controller.extend({
		serverURL: _environment.default.serverPath,
		rootUrl: _environment.default.rootURL,
		querParams: ['page'],
		page: 1,
		actions: {
			nextPage: function nextPage() {

				var page = this.get('page');

				this.set('page', page + 1);
			},
			prevPage: function prevPage() {
				var page = this.get('page');
				this.set('page', page - 1);
			}
		}
	});
});
define('frontend/controllers/forget-password', ['exports', 'frontend/config/environment', 'ember-validations'], function (exports, _environment, _emberValidations) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend(_emberValidations.default, {
    showErrors: false,
    session: Ember.inject.service('session'),
    validations: {
      email: {
        presence: true
      }
    },
    actions: {
      forget: function forget() {
        var _this = this;

        var _getProperties = this.getProperties('email'),
            email = _getProperties.email;

        this.validate().then(function () {
          Ember.$.ajax({
            method: "POST",
            url: _environment.default.serverPath + 'users/forget-password/',
            data: { email: email }
          }).then(function (data) {
            if (data.success == false) {
              _this.set("showErrors", true);
              _this.get('flashMessages').danger(data.errors);
            } else {
              _this.get('flashMessages').success('Password Reset link has been send to your email');
              _this.transitionToRoute('forget-password');
              _this.setProperties({
                email: ''
              });
            }
          });
        }).catch(function () {
          _this.set("showErrors", true);
        });
      }
    }

  });
});
define('frontend/controllers/gallery', ['exports', 'frontend/config/environment'], function (exports, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Controller.extend({
		session: Ember.inject.service('session'),
		serverURL: _environment.default.serverPath,
		rootUrl: _environment.default.rootURL,
		querParams: ['page'],
		page: 1,
		actions: {
			showGallerySubmission: function showGallerySubmission() {
				Ember.$('#button-show-upload').hide();
				Ember.$('.challenge-submit').show();
			},
			nextPage: function nextPage() {
				var page = this.get('page');
				this.set('page', page + 1);
			},
			prevPage: function prevPage() {
				var page = this.get('page');
				this.set('page', page - 1);
			}
		}
	});
});
define('frontend/controllers/index', ['exports', 'frontend/config/environment'], function (exports, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Controller.extend({
		serverURL: _environment.default.serverPath
	});
});
define('frontend/controllers/login', ['exports', 'ember-validations'], function (exports, _emberValidations) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Controller.extend(_emberValidations.default, {
		showErrors: false,
		session: Ember.inject.service('session'),
		validations: {
			email: {
				presence: true
			},
			password: {
				presence: true
			}
		},
		actions: {
			login: function login() {
				var _this = this;

				var _getProperties = this.getProperties('email', 'password'),
				    email = _getProperties.email,
				    password = _getProperties.password;

				this.get("session").authenticate('authenticator:oauth2', email, password).then(function () {
					_this.get('flashMessages').success('You have signed in successfully');

					_this.setProperties({
						email: '',
						password: ''
					});

					var previousTransition = _this.get('previousTransition');
					if (previousTransition) {
						_this.set('previousTransition', null);
						previousTransition.retry();
					} else {
						// Default back to homepage
						_this.transitionToRoute('index');
						// this.transitionToPreviousRoute()
					}
				}).catch(function (reason) {
					_this.set('showErrors', true);
					_this.get('flashMessages').danger(reason.errors).add({
						timeout: 12000,
						destroyOnClick: true,
						onDestroy: function onDestroy() {
							// behavior triggered when flash is destroyed 
						}
					});
				});
			}
		},
		transitionToPreviousRoute: function transitionToPreviousRoute() {
			var previousTransition = this.get('previousTransition');
			if (previousTransition) {
				this.set('previousTransition', null);
				previousTransition.retry();
			} else {
				// Default back to homepage
				this.transitionToRoute('index');
			}
		}
	});
});
define('frontend/controllers/privacy', ['exports', 'frontend/config/environment'], function (exports, _environment) {
   'use strict';

   Object.defineProperty(exports, "__esModule", {
      value: true
   });
   exports.default = Ember.Controller.extend({
      serverURL: _environment.default.serverPath
   });
});
define('frontend/controllers/register', ['exports', 'frontend/config/environment', 'ember-validations'], function (exports, _environment, _emberValidations) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Controller.extend(_emberValidations.default, {
		showErrors: false,
		session: Ember.inject.service('session'),
		validations: {
			userFirstName: {
				presence: true
			},
			userLastName: {
				presence: true
			},
			userEmail: {
				presence: true
			},
			password: {
				presence: {
					message: ''
				},
				length: {
					minimum: 8,
					messages: {
						tooShort: 'Password too short (Minimum 8 characters)'
					}
				}
			}
		},
		actions: {
			register: function register() {
				var _this = this;

				var _getProperties = this.getProperties('userFirstName', 'userLastName', 'userEmail', 'password', 'subscribeCheck'),
				    userFirstName = _getProperties.userFirstName,
				    userLastName = _getProperties.userLastName,
				    userEmail = _getProperties.userEmail,
				    password = _getProperties.password,
				    subscribeCheck = _getProperties.subscribeCheck;

				if (!subscribeCheck) {
					subscribeCheck = false;
				}
				this.validate().then(function () {
					Ember.$.ajax({
						method: "POST",
						url: _environment.default.serverPath + 'register',
						data: {
							userFirstName: userFirstName,
							userLastName: userLastName,
							userEmail: userEmail,
							userPassword: password,
							// subscribeCheck,
							subscribeCheck: subscribeCheck
						}
					}).then(function (data) {
						if (data.success == false) {
							_this.set("showErrors", true);
							_this.get('flashMessages').danger(data.errors);
						} else {
							_this.get('flashMessages').success('You have Register successfully.Please Check Email to verify Your account');

							_this.setProperties({
								userFirstName: '',
								userLastName: '',
								userEmail: '',
								password: '',
								subscribeCheck: ''
							});
							_this.transitionToRoute('register');
						}
					});
				}).catch(function () {
					_this.set("showErrors", true);
				});
			}
		},
		transitionToPreviousRoute: function transitionToPreviousRoute() {
			var previousTransition = this.get('previousTransition');
			if (previousTransition) {
				this.set('previousTransition', null);
				previousTransition.retry();
			} else {
				// Default back to homepage
				this.transitionToRoute('index');
			}
		}
	});
});
define('frontend/controllers/reset-password-process', ['exports', 'frontend/config/environment', 'ember-validations'], function (exports, _environment, _emberValidations) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend(_emberValidations.default, {
    queryParams: ['token'],
    token: null,
    showErrors: false,
    session: Ember.inject.service('session'),
    validations: {
      newPassword: {
        confirmation: true,
        presence: {
          message: ' New password required'
        },
        length: { minimum: 8 }
      },
      newPasswordConfirmation: {
        presence: {
          message: ' Please confirm password'
        }
      }
    },
    actions: {
      change: function change() {
        var _this = this;

        var _getProperties = this.getProperties('token', 'newPassword', 'newPasswordConfirmation'),
            token = _getProperties.token,
            newPassword = _getProperties.newPassword,
            newPasswordConfirmation = _getProperties.newPasswordConfirmation;

        this.validate().then(function () {

          Ember.$.ajax({
            method: "POST",
            url: _environment.default.serverPath + 'users/reset-password-process/',
            data: { token: token, newPassword: newPassword, newPasswordConfirmation: newPasswordConfirmation }
          }).then(function (data) {
            if (data.success == false) {
              _this.set("showErrors", true);
              _this.get('flashMessages').danger(data.errors);
            } else {
              _this.get('flashMessages').success('Password Reset Successfully');
              _this.setProperties({
                newPassword: '',
                newPasswordConfirmation: ''
              });
              _this.transitionToRoute('login');
            }
          });
        }).catch(function () {
          _this.set("showErrors", true);
        });
      }
    }
  });
});
define('frontend/flash/object', ['exports', 'ember-cli-flash/flash/object'], function (exports, _object) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _object.default;
    }
  });
});
define('frontend/helpers/and', ['exports', 'ember-truth-helpers/helpers/and'], function (exports, _and) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (Ember.Helper) {
    forExport = Ember.Helper.helper(_and.andHelper);
  } else if (Ember.HTMLBars.makeBoundHelper) {
    forExport = Ember.HTMLBars.makeBoundHelper(_and.andHelper);
  }

  exports.default = forExport;
});
define('frontend/helpers/app-version', ['exports', 'frontend/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _environment, _regexp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.appVersion = appVersion;
  var version = _environment.default.APP.version;
  function appVersion(_) {
    var hash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (hash.hideSha) {
      return version.match(_regexp.versionRegExp)[0];
    }

    if (hash.hideVersion) {
      return version.match(_regexp.shaRegExp)[0];
    }

    return version;
  }

  exports.default = Ember.Helper.helper(appVersion);
});
define('frontend/helpers/category-href', ['exports'], function (exports) {
		'use strict';

		Object.defineProperty(exports, "__esModule", {
				value: true
		});
		exports.categoryHref = categoryHref;
		function categoryHref(category) {

				var categoryType = category[0] === undefined ? '' : category[0].toLowerCase();

				var categoryUrl =
				// if category is "aticle" or "challenge", pluralize it in order to generate the url
				/article/.test(categoryType) || /challenge/.test(categoryType) ? '/' + categoryType + 's' : '/' + categoryType;
				return categoryUrl;
		}

		exports.default = Ember.Helper.helper(categoryHref);
});
define('frontend/helpers/category-tag-class', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.categoryTag = categoryTag;
	function categoryTag(categoryTag) {
		return categoryTag[0] === undefined ? '' : categoryTag[0].toLowerCase();
	}

	exports.default = Ember.Helper.helper(categoryTag);
});
define('frontend/helpers/category-tag', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.categoryTag = categoryTag;
	function categoryTag(category) {
		var firstLetterOfCategory = category[0] === undefined ? '' : category[0].split('')[0];
		return firstLetterOfCategory;
	}

	exports.default = Ember.Helper.helper(categoryTag);
});
define('frontend/helpers/category-view-all-text', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.categoryViewAllText = categoryViewAllText;
	function categoryViewAllText(categories) {

		var category = categories[0] === undefined ? '' : categories[0].toLowerCase();

		var categoryText = category === 'article' ? 'View All Articles' : category === 'challenge' ? 'View All Challenges' : category === 'create' ? 'More To Create' : 'View All';

		return categoryText;
	}

	exports.default = Ember.Helper.helper(categoryViewAllText);
});
define('frontend/helpers/change-author-name', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.changeAuthorName = changeAuthorName;
	function changeAuthorName(categoryID) {
		/* 
  	Arguments are the article IDs
  */
		var thisID = categoryID[0];

		var articleIDs = categoryID.filter(function (cat, index) {
			if (index > 0) {
				return cat;
			}
		});

		var authorName = articleIDs.filter(function (id) {
			return id === thisID;
		}).map(function (articleID) {
			if (articleID === thisID) {
				return 'Tom DeSanto';
			}
		});

		return authorName.length === 0 ? '8th Mind' : authorName;
	}

	exports.default = Ember.Helper.helper(changeAuthorName);
});
define('frontend/helpers/ember-cli-lightbox', ['exports', 'frontend/config/environment', 'ember-cli-lightbox'], function (exports, _environment, _emberCliLightbox) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.initialize = initialize;
	// import Ember from 'ember';
	function initialize() {
		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _emberCliLightbox.default.initialize.apply(null, [_environment.default['ember-cli-lightbox']].concat(args));
	}

	exports.default = {
		name: _emberCliLightbox.default.name,
		initialize: initialize
	};
});
define('frontend/helpers/eq', ['exports', 'ember-truth-helpers/helpers/equal'], function (exports, _equal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (Ember.Helper) {
    forExport = Ember.Helper.helper(_equal.equalHelper);
  } else if (Ember.HTMLBars.makeBoundHelper) {
    forExport = Ember.HTMLBars.makeBoundHelper(_equal.equalHelper);
  }

  exports.default = forExport;
});
define('frontend/helpers/get-post-row-class', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.getPostRowClass = getPostRowClass;
	function getPostRowClass(params) {
		var articles = params[0];
		return articles.length === 6 ? 'post-row-length-1' : articles.length === 7 ? 'post-row-length-2' : '';
	}

	exports.default = Ember.Helper.helper(getPostRowClass);
});
define('frontend/helpers/gt', ['exports', 'ember-truth-helpers/helpers/gt'], function (exports, _gt) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (Ember.Helper) {
    forExport = Ember.Helper.helper(_gt.gtHelper);
  } else if (Ember.HTMLBars.makeBoundHelper) {
    forExport = Ember.HTMLBars.makeBoundHelper(_gt.gtHelper);
  }

  exports.default = forExport;
});
define('frontend/helpers/gte', ['exports', 'ember-truth-helpers/helpers/gte'], function (exports, _gte) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (Ember.Helper) {
    forExport = Ember.Helper.helper(_gte.gteHelper);
  } else if (Ember.HTMLBars.makeBoundHelper) {
    forExport = Ember.HTMLBars.makeBoundHelper(_gte.gteHelper);
  }

  exports.default = forExport;
});
define('frontend/helpers/is-a-challenge', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.isAChallenge = isAChallenge;
	function isAChallenge(boolean) {
		// Either true of false boolean
		var isChallenge = boolean[0];
		return isChallenge ? 'challenge' : 'article';
	}

	exports.default = Ember.Helper.helper(isAChallenge);
});
define('frontend/helpers/is-after', ['exports', 'ember-moment/helpers/is-after'], function (exports, _isAfter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isAfter.default;
    }
  });
});
define('frontend/helpers/is-array', ['exports', 'ember-truth-helpers/helpers/is-array'], function (exports, _isArray) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (Ember.Helper) {
    forExport = Ember.Helper.helper(_isArray.isArrayHelper);
  } else if (Ember.HTMLBars.makeBoundHelper) {
    forExport = Ember.HTMLBars.makeBoundHelper(_isArray.isArrayHelper);
  }

  exports.default = forExport;
});
define('frontend/helpers/is-before', ['exports', 'ember-moment/helpers/is-before'], function (exports, _isBefore) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isBefore.default;
    }
  });
});
define('frontend/helpers/is-between', ['exports', 'ember-moment/helpers/is-between'], function (exports, _isBetween) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isBetween.default;
    }
  });
});
define('frontend/helpers/is-equal', ['exports', 'ember-truth-helpers/helpers/is-equal'], function (exports, _isEqual) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isEqual.default;
    }
  });
  Object.defineProperty(exports, 'isEqual', {
    enumerable: true,
    get: function () {
      return _isEqual.isEqual;
    }
  });
});
define('frontend/helpers/is-same-or-after', ['exports', 'ember-moment/helpers/is-same-or-after'], function (exports, _isSameOrAfter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isSameOrAfter.default;
    }
  });
});
define('frontend/helpers/is-same-or-before', ['exports', 'ember-moment/helpers/is-same-or-before'], function (exports, _isSameOrBefore) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isSameOrBefore.default;
    }
  });
});
define('frontend/helpers/is-same', ['exports', 'ember-moment/helpers/is-same'], function (exports, _isSame) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _isSame.default;
    }
  });
});
define('frontend/helpers/lt', ['exports', 'ember-truth-helpers/helpers/lt'], function (exports, _lt) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (Ember.Helper) {
    forExport = Ember.Helper.helper(_lt.ltHelper);
  } else if (Ember.HTMLBars.makeBoundHelper) {
    forExport = Ember.HTMLBars.makeBoundHelper(_lt.ltHelper);
  }

  exports.default = forExport;
});
define('frontend/helpers/lte', ['exports', 'ember-truth-helpers/helpers/lte'], function (exports, _lte) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (Ember.Helper) {
    forExport = Ember.Helper.helper(_lte.lteHelper);
  } else if (Ember.HTMLBars.makeBoundHelper) {
    forExport = Ember.HTMLBars.makeBoundHelper(_lte.lteHelper);
  }

  exports.default = forExport;
});
define('frontend/helpers/moment-add', ['exports', 'ember-moment/helpers/moment-add'], function (exports, _momentAdd) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentAdd.default;
    }
  });
});
define('frontend/helpers/moment-calendar', ['exports', 'ember-moment/helpers/moment-calendar'], function (exports, _momentCalendar) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentCalendar.default;
    }
  });
});
define('frontend/helpers/moment-diff', ['exports', 'ember-moment/helpers/moment-diff'], function (exports, _momentDiff) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentDiff.default;
    }
  });
});
define('frontend/helpers/moment-duration', ['exports', 'ember-moment/helpers/moment-duration'], function (exports, _momentDuration) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentDuration.default;
    }
  });
});
define('frontend/helpers/moment-format', ['exports', 'ember-moment/helpers/moment-format'], function (exports, _momentFormat) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentFormat.default;
    }
  });
});
define('frontend/helpers/moment-from-now', ['exports', 'ember-moment/helpers/moment-from-now'], function (exports, _momentFromNow) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentFromNow.default;
    }
  });
});
define('frontend/helpers/moment-from', ['exports', 'ember-moment/helpers/moment-from'], function (exports, _momentFrom) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentFrom.default;
    }
  });
});
define('frontend/helpers/moment-subtract', ['exports', 'ember-moment/helpers/moment-subtract'], function (exports, _momentSubtract) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentSubtract.default;
    }
  });
});
define('frontend/helpers/moment-to-date', ['exports', 'ember-moment/helpers/moment-to-date'], function (exports, _momentToDate) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentToDate.default;
    }
  });
});
define('frontend/helpers/moment-to-now', ['exports', 'ember-moment/helpers/moment-to-now'], function (exports, _momentToNow) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentToNow.default;
    }
  });
});
define('frontend/helpers/moment-to', ['exports', 'ember-moment/helpers/moment-to'], function (exports, _momentTo) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _momentTo.default;
    }
  });
});
define('frontend/helpers/moment-unix', ['exports', 'ember-moment/helpers/unix'], function (exports, _unix) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _unix.default;
    }
  });
  Object.defineProperty(exports, 'unix', {
    enumerable: true,
    get: function () {
      return _unix.unix;
    }
  });
});
define('frontend/helpers/moment', ['exports', 'ember-moment/helpers/moment'], function (exports, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _moment.default;
    }
  });
});
define('frontend/helpers/not-eq', ['exports', 'ember-truth-helpers/helpers/not-equal'], function (exports, _notEqual) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (Ember.Helper) {
    forExport = Ember.Helper.helper(_notEqual.notEqualHelper);
  } else if (Ember.HTMLBars.makeBoundHelper) {
    forExport = Ember.HTMLBars.makeBoundHelper(_notEqual.notEqualHelper);
  }

  exports.default = forExport;
});
define('frontend/helpers/not', ['exports', 'ember-truth-helpers/helpers/not'], function (exports, _not) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (Ember.Helper) {
    forExport = Ember.Helper.helper(_not.notHelper);
  } else if (Ember.HTMLBars.makeBoundHelper) {
    forExport = Ember.HTMLBars.makeBoundHelper(_not.notHelper);
  }

  exports.default = forExport;
});
define('frontend/helpers/now', ['exports', 'ember-moment/helpers/now'], function (exports, _now) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _now.default;
    }
  });
});
define('frontend/helpers/or', ['exports', 'ember-truth-helpers/helpers/or'], function (exports, _or) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (Ember.Helper) {
    forExport = Ember.Helper.helper(_or.orHelper);
  } else if (Ember.HTMLBars.makeBoundHelper) {
    forExport = Ember.HTMLBars.makeBoundHelper(_or.orHelper);
  }

  exports.default = forExport;
});
define('frontend/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _pluralize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _pluralize.default;
});
define('frontend/helpers/short-desc', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.shortDesc = shortDesc;
	function shortDesc(params, namedArgs) {

		var str = params.toString();
		var len = parseInt(namedArgs.len);

		if (str.length > len) {
			var paragraphString = str.substring(0, len);
			var pattern = /<(\w\d|\w)>|<\/(\w\d|\w)>|&nbsp;/gmi;
			var string = paragraphString.replace(pattern, '');
			return string + '...';
		} else {
			return params;
		}
	}

	exports.default = Ember.Helper.helper(shortDesc);
});
define('frontend/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _singularize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _singularize.default;
});
define('frontend/helpers/unix', ['exports', 'ember-moment/helpers/unix'], function (exports, _unix) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _unix.default;
    }
  });
  Object.defineProperty(exports, 'unix', {
    enumerable: true,
    get: function () {
      return _unix.unix;
    }
  });
});
define('frontend/helpers/xor', ['exports', 'ember-truth-helpers/helpers/xor'], function (exports, _xor) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var forExport = null;

  if (Ember.Helper) {
    forExport = Ember.Helper.helper(_xor.xorHelper);
  } else if (Ember.HTMLBars.makeBoundHelper) {
    forExport = Ember.HTMLBars.makeBoundHelper(_xor.xorHelper);
  }

  exports.default = forExport;
});
define('frontend/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'frontend/config/environment'], function (exports, _initializerFactory, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var _config$APP = _environment.default.APP,
      name = _config$APP.name,
      version = _config$APP.version;
  exports.default = {
    name: 'App Version',
    initialize: (0, _initializerFactory.default)(name, version)
  };
});
define('frontend/initializers/container-debug-adapter', ['exports', 'ember-resolver/resolvers/classic/container-debug-adapter'], function (exports, _containerDebugAdapter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('frontend/initializers/data-adapter', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('frontend/initializers/ember-cli-lightbox', ['exports', 'frontend/config/environment', 'ember-cli-lightbox/initializers/ember-cli-lightbox'], function (exports, _environment, _emberCliLightbox) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _emberCliLightbox.default.initialize.apply(null, [_environment.default['ember-cli-lightbox']].concat(args));
  }

  exports.default = {
    name: _emberCliLightbox.default.name,
    initialize: initialize
  };
});
define('frontend/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data'], function (exports, _setupContainer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-data',
    initialize: _setupContainer.default
  };
});
define('frontend/initializers/ember-simple-auth', ['exports', 'frontend/config/environment', 'ember-simple-auth/configuration', 'ember-simple-auth/initializers/setup-session', 'ember-simple-auth/initializers/setup-session-service'], function (exports, _environment, _configuration, _setupSession, _setupSessionService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-simple-auth',

    initialize: function initialize(registry) {
      var config = _environment.default['ember-simple-auth'] || {};
      config.baseURL = _environment.default.rootURL || _environment.default.baseURL;
      _configuration.default.load(config);

      (0, _setupSession.default)(registry);
      (0, _setupSessionService.default)(registry);
    }
  };
});
define('frontend/initializers/export-application-global', ['exports', 'frontend/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_environment.default.exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember.String.classify(_environment.default.modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports.default = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('frontend/initializers/flash-messages', ['exports', 'frontend/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  var deprecate = Ember.deprecate;

  var merge = Ember.assign || Ember.merge;
  var INJECTION_FACTORIES_DEPRECATION_MESSAGE = '[ember-cli-flash] Future versions of ember-cli-flash will no longer inject the service automatically. Instead, you should explicitly inject it into your Route, Controller or Component with `Ember.inject.service`.';
  var addonDefaults = {
    timeout: 3000,
    extendedTimeout: 0,
    priority: 100,
    sticky: false,
    showProgress: false,
    type: 'info',
    types: ['success', 'info', 'warning', 'danger', 'alert', 'secondary'],
    injectionFactories: ['route', 'controller', 'view', 'component'],
    preventDuplicates: false
  };

  function initialize() {
    var application = arguments[1] || arguments[0];

    var _ref = _environment.default || {},
        flashMessageDefaults = _ref.flashMessageDefaults;

    var _ref2 = flashMessageDefaults || [],
        injectionFactories = _ref2.injectionFactories;

    var options = merge(addonDefaults, flashMessageDefaults);
    var shouldShowDeprecation = !(injectionFactories && injectionFactories.length);

    application.register('config:flash-messages', options, { instantiate: false });
    application.inject('service:flash-messages', 'flashMessageDefaults', 'config:flash-messages');

    deprecate(INJECTION_FACTORIES_DEPRECATION_MESSAGE, shouldShowDeprecation, {
      id: 'ember-cli-flash.deprecate-injection-factories',
      until: '2.0.0'
    });

    options.injectionFactories.forEach(function (factory) {
      application.inject(factory, 'flashMessages', 'service:flash-messages');
    });
  }

  exports.default = {
    name: 'flash-messages',
    initialize: initialize
  };
});
define('frontend/initializers/head-tags', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    // ember 1.13 backwards compatibility
    var application = arguments[1] || arguments[0];
    application.inject('service:head-tags', 'router', 'router:main');
  }

  exports.default = {
    name: 'head-tags',
    initialize: initialize
  };
});
define('frontend/initializers/injectStore', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('frontend/initializers/store', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'store',
    after: 'ember-data',
    initialize: function initialize() {}
  };
});
define('frontend/initializers/transforms', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('frontend/initializers/truth-helpers', ['exports', 'ember-truth-helpers/utils/register-helper', 'ember-truth-helpers/helpers/and', 'ember-truth-helpers/helpers/or', 'ember-truth-helpers/helpers/equal', 'ember-truth-helpers/helpers/not', 'ember-truth-helpers/helpers/is-array', 'ember-truth-helpers/helpers/not-equal', 'ember-truth-helpers/helpers/gt', 'ember-truth-helpers/helpers/gte', 'ember-truth-helpers/helpers/lt', 'ember-truth-helpers/helpers/lte'], function (exports, _registerHelper, _and, _or, _equal, _not, _isArray, _notEqual, _gt, _gte, _lt, _lte) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() /* container, application */{

    // Do not register helpers from Ember 1.13 onwards, starting from 1.13 they
    // will be auto-discovered.
    if (Ember.Helper) {
      return;
    }

    (0, _registerHelper.registerHelper)('and', _and.andHelper);
    (0, _registerHelper.registerHelper)('or', _or.orHelper);
    (0, _registerHelper.registerHelper)('eq', _equal.equalHelper);
    (0, _registerHelper.registerHelper)('not', _not.notHelper);
    (0, _registerHelper.registerHelper)('is-array', _isArray.isArrayHelper);
    (0, _registerHelper.registerHelper)('not-eq', _notEqual.notEqualHelper);
    (0, _registerHelper.registerHelper)('gt', _gt.gtHelper);
    (0, _registerHelper.registerHelper)('gte', _gte.gteHelper);
    (0, _registerHelper.registerHelper)('lt', _lt.ltHelper);
    (0, _registerHelper.registerHelper)('lte', _lte.lteHelper);
  }

  exports.default = {
    name: 'truth-helpers',
    initialize: initialize
  };
});
define("frontend/instance-initializers/ember-data", ["exports", "ember-data/instance-initializers/initialize-store-service"], function (exports, _initializeStoreService) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: "ember-data",
    initialize: _initializeStoreService.default
  };
});
define('frontend/instance-initializers/ember-simple-auth', ['exports', 'ember-simple-auth/instance-initializers/setup-session-restoration'], function (exports, _setupSessionRestoration) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-simple-auth',

    initialize: function initialize(instance) {
      (0, _setupSessionRestoration.default)(instance);
    }
  };
});
define('frontend/instance-initializers/head-browser', ['exports', 'frontend/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = undefined;
  function _initialize(owner) {
    if (_environment.default['ember-cli-head'] && _environment.default['ember-cli-head']['suppressBrowserRender']) {
      return true;
    }

    // clear fast booted head (if any)
    var startMeta = document.querySelector('meta[name="ember-cli-head-start"]');
    var endMeta = document.querySelector('meta[name="ember-cli-head-end"]');
    if (startMeta && endMeta) {
      var el = startMeta.nextSibling;
      while (el && el !== endMeta) {
        document.head.removeChild(el);
        el = startMeta.nextSibling;
      }
      document.head.removeChild(startMeta);
      document.head.removeChild(endMeta);
    }

    var component = owner.lookup('component:head-layout');
    component.appendTo(document.head);
  }

  exports.initialize = _initialize;
  exports.default = {
    name: 'head-browser',
    initialize: function initialize() {
      if (typeof FastBoot === 'undefined') {
        _initialize.apply(undefined, arguments);
      }
    }
  };
});
define('frontend/instance-initializers/head-tags', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize(instance) {
    var container = instance.lookup ? instance : instance.container;
    var service = container.lookup('service:head-tags');
    service.get('router').on('didTransition', function () {
      service.collectHeadTags();
    });
  }

  exports.default = {
    name: 'head-tags',
    initialize: initialize
  };
});
define('frontend/models/article', ['exports', 'ember-data'], function (exports, _emberData) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Model = _emberData.default.Model,
	    attr = _emberData.default.attr,
	    hasMany = _emberData.default.hasMany;
	exports.default = Model.extend({

		///////////////////////////////////
		// Common props // Model for "query" or "findAll"
		///////////////////////////////////

		articleID: attr('number'), //articleID
		title: attr('string'), //articleTitle
		body: attr('string'), //articleDescription
		image: attr('string'), //articleImage
		dateStart: attr('date'), //articleStartDate
		tag: attr('string'), //articleTags
		firstName: attr('string'), //userFirstName
		lastName: attr('string'), //userLastName

		///////////////////////////////////
		// Model for "findRecord"
		///////////////////////////////////

		allowComment: attr('boolean'), //articleAllowComment
		allowGallery: attr('boolean'), //articleAllowGallery
		allowSubmission: attr('boolean'), //articleAllowSubmission
		allowVoting: attr('boolean'), //articleAllowUpvoting
		dateEndVoting: attr('date'), //articleEndVotingDate
		dateExpire: attr('date'), //articleExpireDate
		dateCreated: attr('date'), //createdAt
		dateUpdated: attr('date'), //updatedAt
		rules: attr('string'), //articleRules
		status: attr('string'), //articleStatus
		submissionType: attr('string'), //articleSubmissionType
		userID: attr('number'), //userID

		///////////////////////////////////
		// Relationship part of the "findRecord" call
		///////////////////////////////////

		submissions: hasMany('submission'),

		///////////////////////////////////
		// Custom Added
		///////////////////////////////////

		url: attr('string')
	});
});
define('frontend/models/asset', ['exports', 'ember-data'], function (exports, _emberData) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Model = _emberData.default.Model,
	    attr = _emberData.default.attr;
	exports.default = Model.extend({
		caption: attr('string'),
		type: attr('string'),
		image: attr('string'),
		assetID: attr('number')
	});
});
define('frontend/models/submission', ['exports', 'ember-data'], function (exports, _emberData) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Model = _emberData.default.Model,
	    attr = _emberData.default.attr,
	    belongsTo = _emberData.default.belongsTo,
	    hasMany = _emberData.default.hasMany;
	exports.default = Model.extend({
		articleID: belongsTo('article'),
		title: attr('string'),
		name: attr('string'),
		thumb: attr('string'),
		userID: attr('number'),
		dateCreated: attr('date'),
		votes: attr('number'),
		assets: hasMany('asset')
	});
});
define('frontend/models/user', ['exports', 'ember-data'], function (exports, _emberData) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = _emberData.default.Model.extend({
        userID: _emberData.default.attr('number'),
        firstName: _emberData.default.attr('string'),
        lastName: _emberData.default.attr('string'),
        email: _emberData.default.attr('string')
    });
});
define('frontend/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberResolver.default;
});
define('frontend/router', ['exports', 'frontend/config/environment'], function (exports, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});


	var Router = Ember.Router.extend({
		location: _environment.default.locationType,
		rootURL: _environment.default.rootURL
	});

	Router.map(function () {
		this.route('login');
		this.route('register');
		this.route('change-password');
		this.route('activate');
		this.route('forget-password');
		this.route('reset-password-process');
		this.route('articles');
		this.route('create');
		this.route('challenges');
		this.route('article', { path: '/article/:articleID' }, function () {
			this.route('gallery', { path: '/gallery' });
		});
		this.route('gallery', { path: '/gallery/:articleID' }, function () {});
	});

	exports.default = Router;
});
define('frontend/routes/activate', ['exports', 'ember-cli-reset-scroll'], function (exports, _emberCliResetScroll) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Route.extend(_emberCliResetScroll.default, {
		resetScroll: 0
	});
});
define('frontend/routes/application', ['exports', 'ember-simple-auth/mixins/application-route-mixin'], function (exports, _applicationRouteMixin) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Route.extend(_applicationRouteMixin.default, {
		actions: {
			didTransition: function didTransition() {
				$('.header-collapsable-nav').removeClass('active');
				$('.header-nav-toggle').removeClass('active');
			}
		}
	});
});
define('frontend/routes/article', ['exports', 'frontend/config/environment', 'ember-cli-reset-scroll'], function (exports, _environment, _emberCliResetScroll) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Route.extend(_emberCliResetScroll.default, {
		title: '8th Mind',
		session: Ember.inject.service('session'),
		resetScroll: 0,
		headData: Ember.inject.service(),
		actions: {
			didTransition: function didTransition() {
				Ember.$(window).scrollTop(0); // scrollTop position for nested routes
			},
			willTransition: function willTransition() {}
		},
		beforeModel: function beforeModel(transition) {
			var loginController = this.controllerFor('login');
			loginController.set('previousTransition', transition);
		},
		setMetaData: function setMetaData(article) {

			var url = 'http://8thmind.com/article/' + article.articleID;
			var title = article.title;
			var image = _environment.default.serverPath + 'storage/articles/' + article.image;
			var concatBody = function concatBody(body) {
				var length = 140;
				var pattern = /<(\w\d|\w)>|<\/(\w\d|\w)>|&nbsp;/gmi;
				return body.substring(0, length).replace(pattern, '') + '...';
			};
			var description = concatBody(article.body);

			this.set('title', title);
			this.set('ogImage', image);
			this.set('ogUrl', url);
			this.set('ogDescription', description);

			this.set('headData.title', title);
			this.set('headData.url', url);
			this.set('headData.image', image);
			this.set('headData.description', description);
		},
		afterModel: function afterModel(model) {
			this.setMetaData(model.article.data);
		},
		model: function model(params) {

			this.set('params', params);

			var articleID = params.articleID;
			var randomPage = Math.round(Math.random() * 6);
			return Ember.RSVP.hash({
				article: this.store.findRecord('article', articleID),
				related: this.store.query('article', { page: randomPage, per_page: 3 })
			});
		},
		setupController: function setupController(controller, model) {
			controller.set('articleID', this.get('params.articleID'));
			this._super(controller, model);
		}
	});
});
define('frontend/routes/article/gallery', ['exports', 'frontend/config/environment', 'ember-cli-reset-scroll'], function (exports, _environment, _emberCliResetScroll) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Route.extend(_emberCliResetScroll.default, {
		title: '8th Mind',
		resetScroll: 0,
		headData: Ember.inject.service(),
		session: Ember.inject.service('session'),
		serverURL: _environment.default.serverPath,
		rootUrl: _environment.default.rootURL,
		querParams: ['page'],
		page: 1,
		actions: {
			didTransition: function didTransition() {
				Ember.$(window).scrollTop(0);
			},
			showGallerySubmission: function showGallerySubmission() {
				Ember.$('#button-show-upload').hide();
				Ember.$('.challenge-submit').show();
			},
			nextPage: function nextPage() {
				var page = this.get('page');
				this.set('page', page + 1);
			},
			prevPage: function prevPage() {
				var page = this.get('page');
				this.set('page', page - 1);
			}
		},
		model: function model() {
			var article = this.modelFor('article').article;
			var session = this.get('session').session.content.authenticated;
			var store = this.get('store');

			return { article: article, session: session, store: store };
		}
	});
});
define('frontend/routes/articles', ['exports', 'frontend/config/environment', 'ember-cli-reset-scroll'], function (exports, _environment, _emberCliResetScroll) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Route.extend(_emberCliResetScroll.default, {
		title: '8th Mind: Articles',
		queryParams: {
			page: {
				refreshModel: true
			}
		},
		resetScroll: 0,
		beforeModel: function beforeModel(transition) {
			var loginController = this.controllerFor('login');
			loginController.set('previousTransition', transition);
		},
		actions: {
			didTransition: function didTransition() {
				// console.log('didTransition', true);
				return true; // Bubble the didTransition event
			}
		},
		model: function model(params) {

			var url = params['page'] ? _environment.default.serverPath + 'articles/?page=' + params['page'] : _environment.default.serverPath + 'articles/';

			return Ember.$.ajax({
				method: 'GET',
				url: url
			}).then(function (result) {

				var articleCategories = result.result.filter(function (categories) {
					return categories.articleTags === 'Article';
				});

				return Ember.RSVP.hash({
					articles: articleCategories,
					pagination: result.pagination
				});
			});
		}

	});
});
define('frontend/routes/challenges', ['exports', 'frontend/config/environment', 'ember-cli-reset-scroll'], function (exports, _environment, _emberCliResetScroll) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Route.extend(_emberCliResetScroll.default, {
		title: '8th Mind: Challenges',
		queryParams: {
			page: {
				refreshModel: true
			}
		},
		resetScroll: 0,
		beforeModel: function beforeModel(transition) {
			var loginController = this.controllerFor('login');
			loginController.set('previousTransition', transition);
		},
		model: function model(params) {

			var url = params['page'] ? _environment.default.serverPath + 'articles/?page=' + params['page'] : _environment.default.serverPath + 'articles/';

			return Ember.$.ajax({
				method: "GET",
				url: url
			}).then(function (result) {

				var challengeCategories = result.result.filter(function (categories) {
					return categories.articleTags === 'Challenge';
				});

				return Ember.RSVP.hash({
					hasChallenges: challengeCategories.length > 0,
					articles: challengeCategories,
					pagination: result.pagination
				});
			});
		}

	});
});
define('frontend/routes/change-password', ['exports', 'ember-simple-auth/mixins/authenticated-route-mixin'], function (exports, _authenticatedRouteMixin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend(_authenticatedRouteMixin.default, {
    title: '8th Mind: Change Your Password',
    beforeModel: function beforeModel(transition) {
      var loginController = this.controllerFor('login');
      loginController.set('previousTransition', transition);
      this._super();
    }
  });
});
define('frontend/routes/create', ['exports', 'frontend/config/environment', 'ember-cli-reset-scroll'], function (exports, _environment, _emberCliResetScroll) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Route.extend(_emberCliResetScroll.default, {
		title: '8th Mind: Create',
		queryParams: {
			page: {
				refreshModel: true
			}
		},
		resetScroll: 0,
		beforeModel: function beforeModel(transition) {
			var loginController = this.controllerFor('login');
			loginController.set('previousTransition', transition);
		},
		model: function model(params) {

			var url = params['page'] ? _environment.default.serverPath + 'articles/?page=' + params['page'] : _environment.default.serverPath + 'articles/';

			return Ember.$.ajax({
				method: "GET",
				url: url
			}).then(function (result) {
				var createCategories = result.result.filter(function (categories) {
					return categories.articleTags === 'Create';
				});
				return Ember.RSVP.hash({
					articles: createCategories,
					pagination: result.pagination
				});
			});
		}

	});
});
define('frontend/routes/forget-password', ['exports', 'ember-cli-reset-scroll'], function (exports, _emberCliResetScroll) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Route.extend(_emberCliResetScroll.default, {
		title: '8th Mind: Forgot Your Password?',
		resetScroll: 0
	});
});
define('frontend/routes/gallery', ['exports', 'ember-cli-reset-scroll'], function (exports, _emberCliResetScroll) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Route.extend(_emberCliResetScroll.default, {
		resetScroll: 0,
		actions: {
			didTransition: function didTransition() {
				Ember.$(window).scrollTop(0);
			}
		},
		session: Ember.inject.service('session'),
		model: function model(params) {
			// /* galleryModel() is async */
			return this.store.findRecord('submission', params.articleID);
		},
		beforeModel: function beforeModel(transition) {
			var loginController = this.controllerFor('login');
			loginController.set('previousTransition', transition);
		}
	});
});
define('frontend/routes/index', ['exports', 'frontend/config/environment', 'ember-cli-reset-scroll'], function (exports, _environment, _emberCliResetScroll) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Route.extend(_emberCliResetScroll.default, {
		title: 'Welcome to 8th Mind',
		resetScroll: 0,
		headData: Ember.inject.service(),
		model: function model() {
			return this.store.query('article', { 'per_page': 12 });
		},
		afterModel: function afterModel() {
			this.set('headData.title', this.get('title'));
			this.set('headData.url', _environment.default.sharable.defaults.url);
			this.set('headData.image', _environment.default.sharable.defaults.image);
			this.set('headData.description', _environment.default.sharable.defaults.description);
		}
	});
});
define('frontend/routes/login', ['exports', 'ember-cli-reset-scroll'], function (exports, _emberCliResetScroll) {
     'use strict';

     Object.defineProperty(exports, "__esModule", {
          value: true
     });
     exports.default = Ember.Route.extend(_emberCliResetScroll.default, {
          title: '8th Mind: Login',
          resetScroll: 0
     });
});
define('frontend/routes/privacy', ['exports', 'ember-cli-reset-scroll'], function (exports, _emberCliResetScroll) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Route.extend(_emberCliResetScroll.default, {
		title: '8th Mind: Terms of Use & Privacy Policy',
		resetScroll: 0
	});
});
define('frontend/routes/register', ['exports', 'ember-cli-reset-scroll'], function (exports, _emberCliResetScroll) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Route.extend(_emberCliResetScroll.default, {
		title: '8th Mind: Register',
		resetScroll: 0
	});
});
define('frontend/routes/reset-password-process', ['exports', 'ember-cli-reset-scroll'], function (exports, _emberCliResetScroll) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Route.extend(_emberCliResetScroll.default, {
		title: '8th Mind: Reset Your Password',
		resetScroll: 0
	});
});
define('frontend/scripts/gallery-controller', ['exports', 'frontend/config/environment'], function (exports, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.createSubmission = exports.getGalleryModel = undefined;
	exports.deleteAsset = deleteAsset;
	exports.handleUpvote = handleUpvote;

	function _asyncToGenerator(fn) {
		return function () {
			var gen = fn.apply(this, arguments);
			return new Promise(function (resolve, reject) {
				function step(key, arg) {
					try {
						var info = gen[key](arg);
						var value = info.value;
					} catch (error) {
						reject(error);
						return;
					}

					if (info.done) {
						resolve(value);
					} else {
						return Promise.resolve(value).then(function (value) {
							step("next", value);
						}, function (err) {
							step("throw", err);
						});
					}
				}

				return step("next");
			});
		};
	}

	var getGalleryModel = exports.getGalleryModel = function () {
		var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(params) {
			var articleID, authenticated, userID, submissionUrl, submissionData, galleryData, challengeArticleUrl, challengeArticleData, articleData, galleryModel;
			return regeneratorRuntime.wrap(function _callee2$(_context2) {
				while (1) {
					switch (_context2.prev = _context2.next) {
						case 0:
							articleID = params.articleID;
							authenticated = this.get('session.data.authenticated');
							userID = authenticated.userID;

							/* Get the submissions to create the gallery */

							submissionUrl = galleryAPI(articleID).allSubmissions;
							_context2.next = 6;
							return Ember.$.get(submissionUrl);

						case 6:
							submissionData = _context2.sent;


							/*
       	Get the "assetResults" after getting the submission ID, from the
       	first call in "submissionData". Using the "await" keyword again on
       	the map argument function to pause until we have that submission ID.
       */
							galleryData = submissionData.map(function () {
								var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(submission) {
									var assetResults, galleryArray;
									return regeneratorRuntime.wrap(function _callee$(_context) {
										while (1) {
											switch (_context.prev = _context.next) {
												case 0:
													_context.next = 2;
													return Ember.$.get(submissionUrl + submission.articleSubmissionID);

												case 2:
													assetResults = _context.sent;
													galleryArray = assetResults.assets.map(function (submission) {
														return {
															id: submission.articleSubmissionAssetID,
															date: submission.createdAt,
															image: _environment.default.serverPath + 'storage/submission/photo/' + submission.assetPath,
															caption: submission.caption
														};
													});
													return _context.abrupt('return', {
														userID: submission.userID,
														id: submission.articleSubmissionID,
														name: submission.userDisplayName,
														title: submission.submissionTitle,
														upVotes: submission.upvotes,
														downVotes: submission.downvotes,
														images: galleryArray.reverse(),
														thumb: submission.thumbUrl
													});

												case 5:
												case 'end':
													return _context.stop();
											}
										}
									}, _callee, this);
								}));

								return function (_x2) {
									return _ref2.apply(this, arguments);
								};
							}());

							/*  Get the challenge article detail for the header */

							challengeArticleUrl = _environment.default.serverPath + 'articles/detail/' + articleID;
							_context2.next = 11;
							return Ember.$.get(challengeArticleUrl);

						case 11:
							challengeArticleData = _context2.sent;
							articleData = challengeArticleData.map(function (article) {
								var ifYes = function ifYes(string) {
									return string.toLowerCase() === 'yes' ? true : false;
								};
								return {
									id: article.articleID,
									gallery: ifYes(article.articleAllowGallery),
									upVoting: ifYes(article.articleAllowUpvoting),
									comments: ifYes(article.articleAllowComment),
									submissions: ifYes(article.articleAllowSubmission),
									submissionType: article.articleSubmissionType,
									dateStart: article.articleStartDate,
									dateEndVoting: article.articleEndVotingDate,
									dateCreated: article.createdAt,
									dateExpires: article.articleExpireDate,
									dateUpdated: article.updatedAt,
									image: article.articleImage,
									title: article.articleTitle,
									author: article.userFirstName + ' ' + article.userLastName,
									rules: article.articleRules
								};
							})[0];
							_context2.t0 = userID;
							_context2.next = 16;
							return Promise.all(galleryData);

						case 16:
							_context2.t1 = _context2.sent;
							_context2.t2 = articleData;
							galleryModel = {
								userID: _context2.t0,
								gallery: _context2.t1,
								article: _context2.t2
							};
							return _context2.abrupt('return', galleryModel);

						case 20:
						case 'end':
							return _context2.stop();
					}
				}
			}, _callee2, this);
		}));

		return function getGalleryModel(_x) {
			return _ref.apply(this, arguments);
		};
	}();

	function deleteSubmission(assetDeleted, articleID, submissionID) {

		if (assetDeleted.success) {
			var api = galleryAPI(articleID);
			var url = api.submission(submissionID);
			this.get('session').authorize('authorizer:oauth2', function (headerName, headerValue) {
				Ember.$.ajax({
					beforeSend: function beforeSend(xhr) {
						xhr.setRequestHeader(headerName, headerValue);
					},

					url: url,
					type: 'DELETE',
					dataType: 'json',
					success: function success(result) {
						/* Delete submission success! */
						Ember.$('[data-submission-id=' + submissionID + ']').hide();
						return result;
					},
					error: function error(_error) {
						/* There was an error deleting the submission. */
						return _error;
					}
				});
			});
		}
	}

	function deleteAsset(articleID, submissionID, assetID, session) {

		var self = this;
		var api = galleryAPI(articleID);
		var url = assetID ? api.asset(submissionID, assetID) : api.submission(submissionID);
		var userID = session.session.content.authenticated.userID;

		if (confirm('Are you sure you want to delete this submission?')) {
			this.get('session').authorize('authorizer:oauth2', function (headerName, headerValue) {

				Ember.$.ajax({
					beforeSend: function beforeSend(xhr) {
						xhr.setRequestHeader(headerName, headerValue);
					},

					method: 'DELETE',
					url: url,
					success: function () {
						var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(result) {
							var submissionUrl, submissionData, userSubmission, userSubmissionResults;
							return regeneratorRuntime.wrap(function _callee3$(_context3) {
								while (1) {
									switch (_context3.prev = _context3.next) {
										case 0:
											if (result.success) {
												_context3.next = 4;
												break;
											}

											self.get('flashMessages').warning('Sorry. You can’t delete this submission.');
											_context3.next = 15;
											break;

										case 4:

											self.get('flashMessages').success('Submission successfully deleted.');

											submissionUrl = galleryAPI(articleID).allSubmissions;
											_context3.next = 8;
											return Ember.$.get(submissionUrl);

										case 8:
											submissionData = _context3.sent;
											userSubmission = filterUserSubmission(submissionData, userID);
											_context3.next = 12;
											return Ember.$.get(submissionUrl + userSubmission.articleSubmissionID);

										case 12:
											userSubmissionResults = _context3.sent;


											$('[data-asset-id=' + assetID + ']').fadeOut();

											if (userSubmissionResults.assets.length === 0) {
												deleteSubmission.apply(self, [result, articleID, submissionID]);
											}

										case 15:
										case 'end':
											return _context3.stop();
									}
								}
							}, _callee3, this);
						}));

						function success(_x3) {
							return _ref3.apply(this, arguments);
						}

						return success;
					}(),
					error: function error(_error2) {
						/* There was an error deleting the asset. */
						return _error2;
					}
				});
			});
		}
	}

	var createSubmission = exports.createSubmission = function () {
		var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(articleID) {
			var api, allSubmissionsUrl, USER_ID, addSubmissionForm, submissionObjectData, formData, allSubmissions, userSubmission;
			return regeneratorRuntime.wrap(function _callee4$(_context4) {
				while (1) {
					switch (_context4.prev = _context4.next) {
						case 0:
							api = galleryAPI(articleID);
							allSubmissionsUrl = api.allSubmissions;
							USER_ID = this.get('session').session.content.authenticated.userID;
							addSubmissionForm = $('#add-submission')[0];
							submissionObjectData = $('input[type=file]')[0].files[0];
							formData = new FormData(addSubmissionForm);

							formData.append('type', 'Image');
							formData.append('assetfile', submissionObjectData);

							_context4.next = 10;
							return Ember.$.get(allSubmissionsUrl);

						case 10:
							allSubmissions = _context4.sent;
							_context4.next = 13;
							return filterUserSubmission(allSubmissions, USER_ID);

						case 13:
							userSubmission = _context4.sent;


							makeSubmissionRequest.apply(this, [articleID, userSubmission, formData]);

						case 15:
						case 'end':
							return _context4.stop();
					}
				}
			}, _callee4, this);
		}));

		return function createSubmission(_x4) {
			return _ref4.apply(this, arguments);
		};
	}();

	function makeSubmissionRequest(articleID, submission, formData) {
		var self = this;
		var submissionID = submission ? submission.articleSubmissionID : false;
		var api = galleryAPI(articleID);
		var url = submissionID ? api.newAsset(submissionID) : api.newSubmission;

		self.get('session').authorize('authorizer:oauth2', function (headerName, headerValue) {
			Ember.$.ajax({
				beforeSend: function beforeSend(xhr) {
					xhr.setRequestHeader(headerName, headerValue);
				},

				method: 'POST',
				url: url,
				enctype: 'multipart/form-data',
				processData: false,
				contentType: false,
				cache: false,
				dataType: 'json',
				data: formData,
				success: function success(result) {
					if (!result.success) {
						self.get('flashMessages').warning(result.errors);
					} else {
						createSubmissionAsset.apply(self, [articleID, result]);
					}
				},
				error: function error(_error3) {
					return _error3;
				}
			});
		});
	}

	function filterUserSubmission(allSubmissions, userID) {
		return allSubmissions.filter(function (submission) {
			return submission.userID !== userID ? false : submission.articleSubmissionID;
		})[0];
	}

	function createSubmissionAsset(articleID, response) {

		var self = this;
		var api = galleryAPI(articleID);
		var newAssetURL = api.newAsset(response.insertId);
		var form = $('#add-asset')[0];
		var formData = new FormData(form);
		formData.append('type', 'Image');
		formData.append('assetfile', $('#assetFile')[0].files[0]);

		self.get('session').authorize('authorizer:oauth2', function (headerName, headerValue) {
			Ember.$.ajax({
				beforeSend: function beforeSend(xhr) {
					xhr.setRequestHeader(headerName, headerValue);
				},

				url: newAssetURL,
				type: 'POST',
				enctype: 'multipart/form-data',
				processData: false,
				contentType: false,
				cache: false,
				timeout: 600000,
				data: formData,
				success: function success(result) {
					if (!result.success) {
						self.get('flashMessages').warning(result.errors);
					} else {
						// updateGallery;
						self.get('flashMessages').success('Asset successfully added');
					}
				},
				error: function error(_error4) {
					// updateGallery;
					self.get('flashMessages').success('Creating submission asset error');
					return _error4;
				}
			});
		});
	}

	function galleryAPI(articleID) {
		var baseURL = _environment.default.serverPath + 'articles/' + articleID + '/submissions/';
		return {
			allSubmissions: baseURL,
			newSubmission: baseURL + 'new',
			submission: function submission(submissionID) {
				return baseURL + submissionID;
			},
			newAsset: function newAsset(submissionID) {
				return baseURL + submissionID + '/asset/new';
			},
			asset: function asset(submissionID, assetID) {
				return baseURL + submissionID + '/asset/' + assetID;
			}
		};
	}

	function handleUpvote(submissionID, articleID) {
		var _this = this;

		var gallerySubmission = $('[data-submission-id="' + submissionID + '"');

		if (submissionID > 0) {

			var api = galleryAPI(articleID);
			var url = api.submission(submissionID);

			this.get('session').authorize('authorizer:oauth2', function (headerName, headerValue) {

				// console.log({submissionID, articleID, headerName, headerValue, url})

				Ember.$.ajax({
					beforeSend: function beforeSend(xhr) {
						xhr.setRequestHeader(headerName, headerValue);
					},
					method: 'POST',
					data: {
						articleID: articleID
					},
					url: url
				}).then(function (data) {
					if (!data.success) {
						_this.get('flashMessages').danger(data.errors);
					} else {
						var html = '';
						var heart = '<i class="icon-heart"><svg viewBox="0 0 96.6 85.1"><path class="icon-sprite heart--like" d="M96.6,26.5C96.6,11.9,84.7,0,70.1,0c-8.8,0-16.7,4.3-21.5,11l0,0l0,0C43.8,4.3,36,0,27.1,0 C12.5,0,0.6,11.9,0.6,26.5c0,7.9,3.5,15,8.9,19.8l39.1,38.8l39.4-39l0,0C93.3,41.2,96.6,34.3,96.6,26.5z"/></svg></i>';
						if (data.success.type == 'like') {
							html += data.success.total_likes + heart;
						} else {
							html -= data.success.total_likes + heart;
						}
						gallerySubmission.html(html);
					}
				});
			});
		}
	}
});
define("frontend/scripts/gsap.SplitText", ["module"], function (module) {
	"use strict";

	/* eslint-disable */
	/*!
  * VERSION: 0.3.5
  * DATE: 2016-05-24
  * UPDATES AND DOCS AT: http://greensock.com
  *
  * @license Copyright (c) 2008-2016, GreenSock. All rights reserved.
  * SplitText is a Club GreenSock membership benefit; You must have a valid membership to use
  * this code without violating the terms of use. Visit http://www.greensock.com/club/ to sign up or get more details.
  * This work is subject to the software agreement that was issued with your membership.
  *
  * @author: Jack Doyle, jack@greensock.com
  */
	var _gsScope = typeof module !== "undefined" && module.exports && typeof global !== "undefined" ? global : undefined || window; //helps ensure compatibility with AMD/RequireJS and CommonJS/Node
	(function (window) {

		"use strict";

		var _globals = window.GreenSockGlobals || window,
		    _namespace = function _namespace(ns) {
			var a = ns.split("."),
			    p = _globals,
			    i;
			for (i = 0; i < a.length; i++) {
				p[a[i]] = p = p[a[i]] || {};
			}
			return p;
		},
		    pkg = _namespace("com.greensock.utils"),
		    _getText = function _getText(e) {
			var type = e.nodeType,
			    result = "";
			if (type === 1 || type === 9 || type === 11) {
				if (typeof e.textContent === "string") {
					return e.textContent;
				} else {
					for (e = e.firstChild; e; e = e.nextSibling) {
						result += _getText(e);
					}
				}
			} else if (type === 3 || type === 4) {
				return e.nodeValue;
			}
			return result;
		},
		    _doc = document,
		    _getComputedStyle = _doc.defaultView ? _doc.defaultView.getComputedStyle : function () {},
		    _capsExp = /([A-Z])/g,
		    _getStyle = function _getStyle(t, p, cs, str) {
			var result;
			if (cs = cs || _getComputedStyle(t, null)) {
				t = cs.getPropertyValue(p.replace(_capsExp, "-$1").toLowerCase());
				result = t || cs.length ? t : cs[p]; //Opera behaves VERY strangely - length is usually 0 and cs[p] is the only way to get accurate results EXCEPT when checking for -o-transform which only works with cs.getPropertyValue()!
			} else if (t.currentStyle) {
				cs = t.currentStyle;
				result = cs[p];
			}
			return str ? result : parseInt(result, 10) || 0;
		},
		    _isArrayLike = function _isArrayLike(e) {
			return e.length && e[0] && (e[0].nodeType && e[0].style && !e.nodeType || e[0].length && e[0][0]) ? true : false; //could be an array of jQuery objects too, so accommodate that.
		},
		    _flattenArray = function _flattenArray(a) {
			var result = [],
			    l = a.length,
			    i,
			    e,
			    j;
			for (i = 0; i < l; i++) {
				e = a[i];
				if (_isArrayLike(e)) {
					j = e.length;
					for (j = 0; j < e.length; j++) {
						result.push(e[j]);
					}
				} else {
					result.push(e);
				}
			}
			return result;
		},
		    _stripExp = /(?:\r|\n|\s\s|\t\t)/g,
		    //find carriage returns, new line feeds, double-spaces, and double-tabs.
		_brSwap = ")eefec303079ad17405c",
		    _brExp = /(?:<br>|<br\/>|<br \/>)/gi,
		    _isOldIE = _doc.all && !_doc.addEventListener,
		    _divStart = "<div style='position:relative;display:inline-block;" + (_isOldIE ? "*display:inline;*zoom:1;'" : "'"),
		    //note: we must use both display:inline-block and *display:inline for IE8 and earlier, otherwise it won't flow correctly (and if we only use display:inline, IE won't render most of the property tweens - very odd).
		_cssClassFunc = function _cssClassFunc(cssClass) {
			cssClass = cssClass || "";
			var iterate = cssClass.indexOf("++") !== -1,
			    num = 1;
			if (iterate) {
				cssClass = cssClass.split("++").join("");
			}
			return function () {
				return _divStart + (cssClass ? " class='" + cssClass + (iterate ? num++ : "") + "'>" : ">");
			};
		},
		    SplitText = pkg.SplitText = _globals.SplitText = function (element, vars) {
			if (typeof element === "string") {
				element = SplitText.selector(element);
			}
			if (!element) {
				throw "cannot split a null element.";
			}
			this.elements = _isArrayLike(element) ? _flattenArray(element) : [element];
			this.chars = [];
			this.words = [];
			this.lines = [];
			this._originals = [];
			this.vars = vars || {};
			this.split(vars);
		},
		    _swapText = function _swapText(element, oldText, newText) {
			var type = element.nodeType;
			if (type === 1 || type === 9 || type === 11) {
				for (element = element.firstChild; element; element = element.nextSibling) {
					_swapText(element, oldText, newText);
				}
			} else if (type === 3 || type === 4) {
				element.nodeValue = element.nodeValue.split(oldText).join(newText);
			}
		},
		    _pushReversed = function _pushReversed(a, merge) {
			var i = merge.length;
			while (--i > -1) {
				a.push(merge[i]);
			}
		},
		    _split = function _split(element, vars, allChars, allWords, allLines) {
			if (_brExp.test(element.innerHTML)) {
				element.innerHTML = element.innerHTML.replace(_brExp, _brSwap); //swap in a unique string for <br/> tags so that we can identify it when we loop through later, and replace it appropriately
			}
			var text = _getText(element),
			    types = vars.type || vars.split || "chars,words,lines",
			    lines = types.indexOf("lines") !== -1 ? [] : null,
			    words = types.indexOf("words") !== -1,
			    chars = types.indexOf("chars") !== -1,
			    absolute = vars.position === "absolute" || vars.absolute === true,
			    space = absolute ? "&#173; " : " ",
			    lineOffsetY = -999,
			    cs = _getComputedStyle(element),
			    paddingLeft = _getStyle(element, "paddingLeft", cs),
			    borderTopAndBottom = _getStyle(element, "borderBottomWidth", cs) + _getStyle(element, "borderTopWidth", cs),
			    borderLeftAndRight = _getStyle(element, "borderLeftWidth", cs) + _getStyle(element, "borderRightWidth", cs),
			    padTopAndBottom = _getStyle(element, "paddingTop", cs) + _getStyle(element, "paddingBottom", cs),
			    padLeftAndRight = _getStyle(element, "paddingLeft", cs) + _getStyle(element, "paddingRight", cs),
			    textAlign = _getStyle(element, "textAlign", cs, true),
			    origHeight = element.clientHeight,
			    origWidth = element.clientWidth,
			    wordEnd = "</div>",
			    wordStart = _cssClassFunc(vars.wordsClass),
			    charStart = _cssClassFunc(vars.charsClass),
			    iterateLine = (vars.linesClass || "").indexOf("++") !== -1,
			    linesClass = vars.linesClass,
			    hasTagStart = text.indexOf("<") !== -1,
			    wordIsOpen = true,
			    charArray = [],
			    wordArray = [],
			    lineArray = [],
			    l,
			    curLine,
			    isChild,
			    splitText,
			    i,
			    j,
			    character,
			    nodes,
			    node,
			    offset,
			    lineNode,
			    style,
			    lineWidth,
			    addWordSpaces;

			if (!vars.reduceWhiteSpace !== false) {
				text = text.replace(_stripExp, "");
			}
			if (iterateLine) {
				linesClass = linesClass.split("++").join("");
			}
			if (hasTagStart) {
				text = text.split("<").join("{{LT}}"); //we can't leave "<" in the string, or when we set the innerHTML, it can be interpreted as
			}
			l = text.length;

			splitText = wordStart();
			for (i = 0; i < l; i++) {
				character = text.charAt(i);
				if (character === ")" && text.substr(i, 20) === _brSwap) {
					splitText += (wordIsOpen ? wordEnd : "") + "<BR/>";
					wordIsOpen = false;
					if (i !== l - 20 && text.substr(i + 20, 20) !== _brSwap) {
						splitText += " " + wordStart();
						wordIsOpen = true;
					}
					i += 19;
				} else if (character === " " && text.charAt(i - 1) !== " " && i !== l - 1 && text.substr(i - 20, 20) !== _brSwap) {
					splitText += wordIsOpen ? wordEnd : "";
					wordIsOpen = false;
					while (text.charAt(i + 1) === " ") {
						//skip over empty spaces (to avoid making them words)
						splitText += space;
						i++;
					}
					if (text.charAt(i + 1) !== ")" || text.substr(i + 1, 20) !== _brSwap) {
						splitText += space + wordStart();
						wordIsOpen = true;
					}
				} else if (character === "{" && text.substr(i, 6) === "{{LT}}") {
					splitText += chars ? charStart() + "{{LT}}" + "</div>" : "{{LT}}";
					i += 5;
				} else {
					splitText += chars && character !== " " ? charStart() + character + "</div>" : character;
				}
			}
			element.innerHTML = splitText + (wordIsOpen ? wordEnd : "");

			if (hasTagStart) {
				_swapText(element, "{{LT}}", "<");
			}
			//copy all the descendant nodes into an array (we can't use a regular nodeList because it's live and we may need to renest things)
			j = element.getElementsByTagName("*");
			l = j.length;
			nodes = [];
			for (i = 0; i < l; i++) {
				nodes[i] = j[i];
			}

			//for absolute positioning, we need to record the x/y offsets and width/height for every <div>. And even if we're not positioning things absolutely, in order to accommodate lines, we must figure out where the y offset changes so that we can sense where the lines break, and we populate the lines array.
			if (lines || absolute) {
				for (i = 0; i < l; i++) {
					node = nodes[i];
					isChild = node.parentNode === element;
					if (isChild || absolute || chars && !words) {
						offset = node.offsetTop;
						if (lines && isChild && offset !== lineOffsetY && node.nodeName !== "BR") {
							curLine = [];
							lines.push(curLine);
							lineOffsetY = offset;
						}
						if (absolute) {
							//record offset x and y, as well as width and height so that we can access them later for positioning. Grabbing them at once ensures we don't trigger a browser paint & we maximize performance.
							node._x = node.offsetLeft;
							node._y = offset;
							node._w = node.offsetWidth;
							node._h = node.offsetHeight;
						}
						if (lines) {
							if (words === isChild || !chars) {
								curLine.push(node);
								node._x -= paddingLeft;
							}
							if (isChild && i) {
								nodes[i - 1]._wordEnd = true;
							}
							if (node.nodeName === "BR" && node.nextSibling && node.nextSibling.nodeName === "BR") {
								//two consecutive <br> tags signify a new [empty] line.
								lines.push([]);
							}
						}
					}
				}
			}

			for (i = 0; i < l; i++) {
				node = nodes[i];
				isChild = node.parentNode === element;
				if (node.nodeName === "BR") {
					if (lines || absolute) {
						element.removeChild(node);
						nodes.splice(i--, 1);
						l--;
					} else if (!words) {
						element.appendChild(node);
					}
					continue;
				}

				if (absolute) {
					style = node.style;
					if (!words && !isChild) {
						node._x += node.parentNode._x;
						node._y += node.parentNode._y;
					}
					style.left = node._x + "px";
					style.top = node._y + "px";
					style.position = "absolute";
					style.display = "block";
					//if we don't set the width/height, things collapse in older versions of IE and the origin for transforms is thrown off in all browsers.
					style.width = node._w + 1 + "px"; //IE is 1px short sometimes. Avoid wrapping
					style.height = node._h + "px";
				}

				if (!words) {
					//we always start out wrapping words in their own <div> so that line breaks happen correctly, but here we'll remove those <div> tags if necessary and renest the characters directly into the element rather than inside the word <div>
					if (isChild) {
						element.removeChild(node);
						nodes.splice(i--, 1);
						l--;
					} else if (!isChild && chars) {
						offset = !lines && !absolute && node.nextSibling; //if this is the last letter in the word (and we're not breaking by lines and not positioning things absolutely), we need to add a space afterwards so that the characters don't just mash together
						element.appendChild(node);
						if (!offset) {
							element.appendChild(_doc.createTextNode(" "));
						}
						charArray.push(node);
					}
				} else if (isChild && node.innerHTML !== "") {
					wordArray.push(node);
				} else if (chars) {
					charArray.push(node);
				}
			}

			if (lines) {
				//the next 7 lines just give us the line width in the most reliable way and figure out the left offset (if position isn't relative or absolute). We must set the width along with text-align to ensure everything works properly for various alignments.
				if (absolute) {
					lineNode = _doc.createElement("div");
					element.appendChild(lineNode);
					lineWidth = lineNode.offsetWidth + "px";
					offset = lineNode.offsetParent === element ? 0 : element.offsetLeft;
					element.removeChild(lineNode);
				}
				style = element.style.cssText;
				element.style.cssText = "display:none;"; //to improve performance, set display:none on the element so that the browser doesn't have to worry about reflowing or rendering while we're renesting things. We'll revert the cssText later.
				//we can't use element.innerHTML = "" because that causes IE to literally delete all the nodes and their content even though we've stored them in an array! So we must loop through the children and remove them.
				while (element.firstChild) {
					element.removeChild(element.firstChild);
				}
				addWordSpaces = !absolute || !words && !chars;
				for (i = 0; i < lines.length; i++) {
					curLine = lines[i];
					lineNode = _doc.createElement("div");
					lineNode.style.cssText = "display:block;text-align:" + textAlign + ";position:" + (absolute ? "absolute;" : "relative;");
					if (linesClass) {
						lineNode.className = linesClass + (iterateLine ? i + 1 : "");
					}
					lineArray.push(lineNode);
					l = curLine.length;
					for (j = 0; j < l; j++) {
						if (curLine[j].nodeName !== "BR") {
							node = curLine[j];
							lineNode.appendChild(node);
							if (addWordSpaces && (node._wordEnd || words)) {
								lineNode.appendChild(_doc.createTextNode(" "));
							}
							if (absolute) {
								if (j === 0) {
									lineNode.style.top = node._y + "px";
									lineNode.style.left = paddingLeft + offset + "px";
								}
								node.style.top = "0px";
								if (offset) {
									node.style.left = node._x - offset + "px";
								}
							}
						}
					}
					if (l === 0) {
						//if there are no nodes in the line (typically meaning there were two consecutive <br> tags, just add a non-breaking space so that things display properly.
						lineNode.innerHTML = "&nbsp;";
					}
					if (!words && !chars) {
						lineNode.innerHTML = _getText(lineNode).split(String.fromCharCode(160)).join(" ");
					}
					if (absolute) {
						lineNode.style.width = lineWidth;
						lineNode.style.height = node._h + "px";
					}
					element.appendChild(lineNode);
				}
				element.style.cssText = style;
			}

			//if everything shifts to being position:absolute, the container can collapse in terms of height or width, so fix that here.
			if (absolute) {
				if (origHeight > element.clientHeight) {
					element.style.height = origHeight - padTopAndBottom + "px";
					if (element.clientHeight < origHeight) {
						//IE8 and earlier use a different box model - we must include padding and borders
						element.style.height = origHeight + borderTopAndBottom + "px";
					}
				}
				if (origWidth > element.clientWidth) {
					element.style.width = origWidth - padLeftAndRight + "px";
					if (element.clientWidth < origWidth) {
						//IE8 and earlier use a different box model - we must include padding and borders
						element.style.width = origWidth + borderLeftAndRight + "px";
					}
				}
			}
			_pushReversed(allChars, charArray);
			_pushReversed(allWords, wordArray);
			_pushReversed(allLines, lineArray);
		},
		    p = SplitText.prototype;

		p.split = function (vars) {
			if (this.isSplit) {
				this.revert();
			}
			this.vars = vars || this.vars;
			this._originals.length = this.chars.length = this.words.length = this.lines.length = 0;
			var i = this.elements.length;
			//we split in reversed order so that if/when we position:absolute elements, they don't affect the position of the ones after them in the document flow (shifting them up as they're taken out of the document flow).
			while (--i > -1) {
				this._originals[i] = this.elements[i].innerHTML;
				_split(this.elements[i], this.vars, this.chars, this.words, this.lines);
			}
			this.chars.reverse();
			this.words.reverse();
			this.lines.reverse();
			this.isSplit = true;
			return this;
		};

		p.revert = function () {
			if (!this._originals) {
				throw "revert() call wasn't scoped properly.";
			}
			var i = this._originals.length;
			while (--i > -1) {
				this.elements[i].innerHTML = this._originals[i];
			}
			this.chars = [];
			this.words = [];
			this.lines = [];
			this.isSplit = false;
			return this;
		};

		SplitText.selector = window.$ || window.jQuery || function (e) {
			var selector = window.$ || window.jQuery;
			if (selector) {
				SplitText.selector = selector;
				return selector(e);
			}
			return typeof document === "undefined" ? e : document.querySelectorAll ? document.querySelectorAll(e) : document.getElementById(e.charAt(0) === "#" ? e.substr(1) : e);
		};
		SplitText.version = "0.3.5";
	})(_gsScope);

	//export to AMD/RequireJS and CommonJS/Node (precursor to full modular build system coming at a later date)
	(function (name) {
		"use strict";

		var getGlobal = function getGlobal() {
			return (_gsScope.GreenSockGlobals || _gsScope)[name];
		};
		if (typeof define === "function" && define.amd) {
			//AMD
			define([], getGlobal);
		} else if (typeof module !== "undefined" && module.exports) {
			//node
			module.exports = getGlobal();
		}
	})("SplitText");
});
define('frontend/serializers/article', ['exports', 'ember-data'], function (exports, _emberData) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = _emberData.default.RESTSerializer.extend({
		normalizeResponse: function normalizeResponse(store, primaryModelClass, payload, id, requestType) {

			var convertToBoolean = function convertToBoolean(string) {
				return string.toLowerCase() === 'yes' ? true : false;
			};

			if (requestType === 'findRecord') {
				payload = {
					article: payload.map(function (article) {
						return {
							id: article.articleID,
							articleID: article.articleID,
							image: article.articleImage,
							title: article.articleTitle,
							body: article.articleDescription,
							allowComment: convertToBoolean(article.articleAllowComment),
							allowGallery: convertToBoolean(article.articleAllowGallery),
							allowSubmission: convertToBoolean(article.articleAllowSubmission),
							allowVoting: convertToBoolean(article.articleAllowUpvoting),
							dateEndVoting: article.articleEndVotingDate,
							dateExpire: article.articleExpireDate,
							dateCreated: article.createdAt,
							dateUpdated: article.updatedAt,
							rules: article.articleRules,
							dateStart: article.articleStartDate,
							status: article.articleStatus,
							submissionType: article.articleSubmissionType,
							userID: article.userID,
							tag: article.articleTags,
							url: 'http://8thmind.com/article/' + article.articleID,
							links: {
								submissions: '/articles/' + article.articleID + '/submissions/'
							}
						};
					})[0]
				};
			} else {
				payload = {
					articles: payload.result.map(function (article) {
						return {
							id: article.articleID,
							body: article.articleDescription,
							articleID: article.articleID,
							image: article.articleImage,
							dateStart: article.articleStartDate,
							tag: article.articleTags,
							title: article.articleTitle,
							firstName: article.userFirstName,
							lastName: article.userLastName
						};
					})
				};
			}
			// console.log(`Payload for requestType: ${requestType}`, payload)
			return this._super(store, primaryModelClass, payload, id, requestType);
		}
	});
});
define('frontend/serializers/asset', ['exports', 'ember-data', 'frontend/config/environment'], function (exports, _emberData, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = _emberData.default.RESTSerializer.extend({
		normalizeResponse: function normalizeResponse(store, primaryModelClass, payload, id, requestType) {

			payload = {
				assets: payload.assets.map(function (asset) {
					return {
						id: asset.articleSubmissionAssetID,
						caption: asset.caption,
						type: asset.assetType,
						image: _environment.default.serverPath + 'storage/submission/photo/' + asset.assetPath,
						assetID: asset.articleSubmissionAssetID
					};
				})
			};
			// console.log('serializer...',{store, primaryModelClass, payload, id, requestType})
			return this._super(store, primaryModelClass, payload, id, requestType);
		}
	});
});
define('frontend/serializers/submission', ['exports', 'ember-data'], function (exports, _emberData) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = _emberData.default.RESTSerializer.extend({
		mapSubmissions: function mapSubmissions(submission) {
			return {
				id: submission.articleSubmissionID,
				title: submission.submissionTitle,
				name: submission.userDisplayName,
				votes: submission.upvotes,
				userID: submission.userID,
				thumb: submission.thumbUrl,
				dateCreated: submission.createdAt,
				articleID: submission.articleID,
				links: {
					assets: '/articles/' + submission.articleID + '/submissions/' + submission.articleSubmissionID
				}
			};
		},
		normalizeResponse: function normalizeResponse(store, primaryModelClass, payload, id, requestType) {

			if (requestType === 'findRecord') {
				payload = { submissions: payload.map(this.mapSubmissions) };
			}

			if (requestType === 'findHasMany') {
				payload = { submissions: payload.map(this.mapSubmissions) };
			}
			// console.log('serializer submission...',{store, primaryModelClass, payload, id, requestType})

			return this._super(store, primaryModelClass, payload, id, requestType);
		}
	});
});
define('frontend/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _ajax) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _ajax.default;
    }
  });
});
define('frontend/services/cookies', ['exports', 'ember-cookies/services/cookies'], function (exports, _cookies) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _cookies.default;
});
define('frontend/services/facebook-api-client', ['exports', 'ember-social/services/facebook-api-client'], function (exports, _facebookApiClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _facebookApiClient.default;
});
define('frontend/services/flash-messages', ['exports', 'ember-cli-flash/services/flash-messages'], function (exports, _flashMessages) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _flashMessages.default;
    }
  });
});
define('frontend/services/head-data', ['exports', 'ember-cli-head/services/head-data'], function (exports, _headData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _headData.default;
    }
  });
});
define('frontend/services/head-tags', ['exports', 'ember-cli-meta-tags/services/head-tags'], function (exports, _headTags) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _headTags.default;
    }
  });
});
define('frontend/services/linkedin-api-client', ['exports', 'ember-social/services/linkedin-api-client'], function (exports, _linkedinApiClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _linkedinApiClient.default;
});
define('frontend/services/moment', ['exports', 'ember-moment/services/moment', 'frontend/config/environment'], function (exports, _moment, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var get = Ember.get;
  exports.default = _moment.default.extend({
    defaultFormat: get(_environment.default, 'moment.outputFormat')
  });
});
define('frontend/services/scroll-magic', ['exports', 'ember-scrollmagic/services/scroll-magic'], function (exports, _scrollMagic) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _scrollMagic.default;
    }
  });
});
define('frontend/services/session', ['exports', 'ember-simple-auth/services/session'], function (exports, _session) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _session.default;
});
define('frontend/services/sharable', ['exports', 'frontend/config/environment', 'ember-sharable/utils/default-meta-tags', 'ember-sharable/utils/default-link-tags'], function (exports, _environment, _defaultMetaTags, _defaultLinkTags) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed,
      Service = Ember.Service,
      inject = Ember.inject;


  var DEFAULT_CONFIG = {
    props: ['description', 'title', 'image', 'url', 'twitterHandle'],
    current: {},
    metaTagDescriptions: _defaultMetaTags.default,
    linkTagDescriptions: _defaultLinkTags.default,
    defaults: {
      ogType: 'website'
    }
  };

  function getProp(propName) {
    var currentPropKey = 'current.' + propName;
    var defaultPropKey = 'default' + propName;
    return computed(currentPropKey, defaultPropKey, function () {
      var current = this.get(currentPropKey);
      if (typeof current === 'undefined' || current === null) {
        return this.get(defaultPropKey);
      } else {
        return current;
      }
    });
  }

  function getConfigItem(key) {
    var cfg = _environment.default;
    return Ember.get(cfg, 'sharable.' + key) || Ember.get(DEFAULT_CONFIG, key);
  };

  function getDefaultProp(propName) {
    return getConfigItem('defaults.' + propName) || null;
  };

  var PROPS = getConfigItem('props');

  var serviceCfg = {
    _metaTagDescriptions: getConfigItem('metaTagDescriptions'),
    _linkTagDescriptions: getConfigItem('linkTagDescriptions'),
    _resolvedMetaTags: computed('_metaTagDescriptions.[]', 'current.' + PROPS.join(','), function () {
      var _this = this;

      return this.get('_metaTagDescriptions').map(function (desc) {
        var o = {};
        o[desc.namePropertyKey] = desc.namePropertyValue;
        var v = typeof desc.value === 'undefined' ? _this.get('_resolved' + desc.valueProperty) : desc.value;
        if (typeof v === 'undefined' || v === null) {
          return null;
        } else {
          o[desc.valuePropertyKey] = v;
          return o;
        }
      }).reduce(function (r, x) {
        if (x) {
          r.push(x);
        }
        return r;
      }, []);
    }),
    _resolvedLinkTags: computed('_linkTagDescriptions.[]', 'current.' + PROPS.join(','), function () {
      var _this2 = this;

      return this.get('_linkTagDescriptions').map(function (desc) {
        var o = {};
        o[desc.namePropertyKey] = desc.namePropertyValue;
        var v = typeof desc.value === 'undefined' ? _this2.get('_resolved' + desc.valueProperty) : desc.value;
        if (typeof v === 'undefined' || v === null) {
          return null;
        } else {
          o[desc.valuePropertyKey] = v;
          return o;
        }
      }).reduce(function (r, x) {
        if (x) {
          r.push(x);
        }
        return r;
      }, []);
    })
  };

  for (var i = 0; i < PROPS.length; i++) {
    var p = PROPS[i];
    serviceCfg['default' + p] = getDefaultProp(p);
    serviceCfg['_resolved' + p] = getProp(p);
  }

  exports.default = Service.extend(serviceCfg);
});
define('frontend/services/twitter-api-client', ['exports', 'ember-social/services/twitter-api-client'], function (exports, _twitterApiClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _twitterApiClient.default;
});
define('frontend/services/validations', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var set = Ember.set;

  exports.default = Ember.Service.extend({
    init: function init() {
      set(this, 'cache', {});
    }
  });
});
define('frontend/session-stores/application', ['exports', 'ember-simple-auth/session-stores/adaptive'], function (exports, _adaptive) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _adaptive.default.extend();
});
define("frontend/templates/activate", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "oiqAPuS7", "block": "{\"symbols\":[],\"statements\":[[1,[18,\"outlet\"],false],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/activate.hbs" } });
});
define("frontend/templates/application", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "uLXsNrLP", "block": "{\"symbols\":[\"flash\"],\"statements\":[[6,\"header\"],[9,\"id\",\"header\"],[7],[0,\"\\n\\t\"],[6,\"div\"],[9,\"class\",\"header-logo\"],[7],[0,\"\\n\\t\\t\"],[4,\"link-to\",[\"index\"],null,{\"statements\":[[6,\"img\"],[10,\"src\",[26,[[18,\"rootUrl\"],\"assets/images/logo.svg\"]]],[7],[8]],\"parameters\":[]},null],[0,\"\\n\\t\"],[8],[0,\"\\n\\t\"],[6,\"button\"],[9,\"class\",\"header-nav-toggle\"],[3,\"action\",[[19,0,[]],\"toggleNav\"]],[7],[0,\"\\n\\t\\t\"],[6,\"svg\"],[9,\"viewBox\",\"0 0 64 64\"],[7],[0,\"\\n\\t\\t\\t\"],[6,\"rect\"],[9,\"y\",\"8\"],[9,\"width\",\"64\"],[9,\"height\",\"6\"],[7],[8],[0,\"\\n\\t\\t\\t\"],[6,\"rect\"],[9,\"y\",\"28\"],[9,\"width\",\"64\"],[9,\"height\",\"6\"],[7],[8],[0,\"\\n\\t\\t\\t\"],[6,\"rect\"],[9,\"y\",\"48\"],[9,\"width\",\"64\"],[9,\"height\",\"6\"],[7],[8],[0,\"\\n\\t\\t\"],[8],[0,\"\\n\\t\"],[8],[0,\"\\n\\t\"],[6,\"div\"],[9,\"class\",\"header-collapsable-nav\"],[7],[0,\"\\n\\t\\t\"],[6,\"nav\"],[9,\"class\",\"header-nav main-navigation\"],[7],[0,\"\\n\\t\\t\\t\"],[6,\"span\"],[7],[4,\"link-to\",[\"articles\"],null,{\"statements\":[[0,\"Articles\"]],\"parameters\":[]},null],[8],[0,\"\\n\\t\\t\\t\"],[6,\"span\"],[7],[4,\"link-to\",[\"challenges\"],null,{\"statements\":[[0,\"Challenges\"]],\"parameters\":[]},null],[8],[0,\"\\n\\t\\t\\t\"],[6,\"span\"],[7],[4,\"link-to\",[\"create\"],null,{\"statements\":[[0,\"Create\"]],\"parameters\":[]},null],[8],[0,\"\\n\\t\\t\"],[8],[0,\"\\n\\t\\t\"],[6,\"nav\"],[9,\"class\",\"header-nav login-register\"],[7],[0,\"\\n\"],[4,\"if\",[[19,0,[\"session\",\"isAuthenticated\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"login-register-loggedin\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\"],[6,\"span\"],[9,\"class\",\"name\"],[7],[1,[20,[\"session\",\"data\",\"authenticated\",\"userFirstName\"]],false],[0,\" \"],[1,[20,[\"session\",\"data\",\"authenticated\",\"userLastName\"]],false],[8],[0,\"\\n\\t\\t\\t\\t\\t\"],[4,\"link-to\",[\"change-password\"],null,{\"statements\":[[6,\"span\"],[9,\"class\",\"button\"],[7],[0,\"Change Password\"],[8]],\"parameters\":[]},null],[0,\"\\n\\t\\t\\t\\t\\t\"],[6,\"a\"],[9,\"href\",\"#\"],[3,\"action\",[[19,0,[]],\"logout\"]],[7],[6,\"span\"],[9,\"class\",\"button\"],[7],[0,\"Logout\"],[8],[8],[0,\"\\n\\t\\t\\t\\t\"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"\\t\\t\\t\\t\"],[6,\"p\"],[9,\"class\",\"login-register-message\"],[7],[0,\"Join the 8th Mind Community\"],[8],[0,\"\\n\\t\\t\\t\\t\"],[4,\"link-to\",[\"register\"],[[\"class\"],[\"register\"]],{\"statements\":[[6,\"span\"],[9,\"class\",\"button button-gray\"],[7],[0,\"Register\"],[8]],\"parameters\":[]},null],[0,\"\\n\\t\\t\\t\\t\"],[4,\"link-to\",[\"login\"],[[\"class\"],[\"login\"]],{\"statements\":[[6,\"span\"],[9,\"class\",\"button\"],[7],[0,\"Login\"],[8]],\"parameters\":[]},null],[0,\"\\n\"]],\"parameters\":[]}],[0,\"\\t\\t\"],[8],[0,\"\\n\\t\"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"flash-messages\"],[7],[0,\"\\n\"],[4,\"each\",[[19,0,[\"flashMessages\",\"queue\"]]],null,{\"statements\":[[0,\"\\t\\t\"],[1,[25,\"flash-message\",null,[[\"flash\"],[[19,1,[]]]]],false],[0,\"\\n\"]],\"parameters\":[1]},null],[8],[0,\"\\n\\n\"],[1,[18,\"outlet\"],false],[0,\"\\n\\n\"],[6,\"footer\"],[9,\"id\",\"footer\"],[7],[0,\"\\n\\t\"],[6,\"div\"],[9,\"class\",\"col footer-logo\"],[7],[0,\"\\n\\t\\t\"],[6,\"img\"],[10,\"src\",[26,[[18,\"rootUrl\"],\"assets/images/logo.svg\"]]],[7],[8],[0,\"\\n\\t\\t\"],[6,\"span\"],[7],[0,\"8th Mind\"],[8],[0,\"\\n\\t\"],[8],[0,\"\\n\\t\"],[6,\"div\"],[9,\"class\",\"col footer-copy\"],[7],[0,\"\\n\\t\\t\"],[6,\"div\"],[9,\"class\",\"social-media\"],[7],[0,\"\\n\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"social-icon twitter\"],[7],[0,\"\\n\\t\\t\\t\\t\"],[6,\"a\"],[9,\"class\",\"social-bg\"],[9,\"href\",\"https://twitter.com/8thmind\"],[7],[8],[0,\"\\n\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"social-icon facebook\"],[7],[0,\"\\n\\t\\t\\t\\t\"],[6,\"a\"],[9,\"class\",\"social-bg\"],[9,\"href\",\"https://www.facebook.com/8thmind\"],[7],[8],[0,\"\\n\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"social-icon instagram\"],[7],[0,\"\\n\\t\\t\\t\\t\"],[6,\"a\"],[9,\"class\",\"social-bg\"],[9,\"href\",\"https://www.instagram.com/8thmind/\"],[7],[8],[0,\"\\n\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\"],[8],[0,\"\\n\\t\\t\"],[6,\"div\"],[9,\"id\",\"mc_embed_signup\"],[7],[0,\"\\n\\t\\t\\t\"],[6,\"form\"],[9,\"class\",\"validate\"],[9,\"id\",\"mc-embedded-subscribe-form\"],[9,\"action\",\"//8thmind.us16.list-manage.com/subscribe/post?u=d4d629f82da1338a5bc8c2ff1&id=4922fbdc48\"],[9,\"method\",\"post\"],[9,\"name\",\"mc-embedded-subscribe-form\"],[9,\"target\",\"_blank\"],[9,\"novalidate\",\"\"],[7],[0,\"\\n\\t\\t\\t\\t\"],[6,\"div\"],[9,\"id\",\"mc_embed_signup_scroll\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\"],[6,\"input\"],[9,\"class\",\"required email\"],[9,\"id\",\"mce-EMAIL\"],[9,\"type\",\"email\"],[9,\"placeholder\",\"Enter Your Email\"],[9,\"value\",\"\"],[9,\"name\",\"EMAIL\"],[7],[8],[0,\"\\n\\t\\t\\t\\t\\t\"],[6,\"input\"],[9,\"class\",\"button button-blue\"],[9,\"id\",\"mc-embedded-subscribe\"],[9,\"type\",\"submit\"],[9,\"value\",\"Subscribe\"],[9,\"name\",\"subscribe\"],[7],[8],[0,\"\\n\\t\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"clear\"],[9,\"id\",\"mce-responses\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"response\"],[9,\"id\",\"mce-error-response\"],[9,\"style\",\"display:none\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"icon\"],[7],[8],[0,\"\\n\\t\\t\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"response\"],[9,\"id\",\"mce-success-response\"],[9,\"style\",\"display:none\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"icon\"],[7],[8],[0,\"\\n\\t\\t\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\\t\\t\"],[6,\"div\"],[9,\"style\",\"position: absolute; left: -5000px\"],[9,\"aria-hidden\",\"true\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\\t\"],[6,\"input\"],[9,\"type\",\"text\"],[9,\"name\",\"b_d4d629f82da1338a5bc8c2ff1_4922fbdc48\"],[9,\"tabindex\",\"-1\"],[9,\"value\",\"\"],[7],[8],[0,\"\\n\\t\\t\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\\t\"],[6,\"script\"],[7],[0,\"\\n\\t\\t\\t\\t\\tvar script = document.createElement('script');\\n\\t\\t\\t\\t\\tscript.type = 'text/javascript';\\n\\t\\t\\t\\t\\tscript.src = '//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js';\\n\\t\\t\\t\\t\\tdocument.getElementsByTagName('head')[0].appendChild(script);\\n\\t\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\"],[8],[0,\"\\n\\t\\t\"],[6,\"p\"],[9,\"class\",\"copyright\"],[7],[0,\"©2017 Eighth Mind, Inc. All rights reserved. Use of this site constitutes acceptance of our website Terms of Use and Privacy Policy. The material on this site may not be reproduced, distributed, transmitted, cached or otherwise used, except with prior written permission of Eighth Mind, Inc.\"],[8],[0,\"\\n\\t\\t\"],[6,\"p\"],[9,\"class\",\"privacy\"],[7],[0,\"\\n\\t\\t\\t\"],[6,\"a\"],[9,\"href\",\"/privacy\"],[7],[0,\"Terms of Use & Privacy Policy\"],[8],[0,\"\\n\\t\\t\"],[8],[0,\"\\n\\n\\t\"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[2,\"/#footer\"],[0,\"\\n\"],[6,\"script\"],[9,\"async\",\"\"],[9,\"defer\",\"\"],[9,\"src\",\"//assets.pinterest.com/js/pinit.js\"],[7],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/application.hbs" } });
});
define("frontend/templates/article", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "5zLL25lM", "block": "{\"symbols\":[],\"statements\":[[1,[18,\"outlet\"],false],[0,\"\\n\\n\"],[6,\"section\"],[9,\"id\",\"page-article\"],[10,\"data-page-type\",[26,[[25,\"is-a-challenge\",[[19,0,[\"model\",\"article\",\"allowSubmission\"]]],null]]]],[7],[0,\"\\n\\n\\t\"],[6,\"div\"],[9,\"class\",\"page-article-hero post\"],[7],[0,\"\\n\\n\\t\\t\"],[6,\"span\"],[9,\"class\",\"post-type\"],[7],[1,[20,[\"model\",\"article\",\"submissionType\"]],false],[0,\" Challenge\"],[8],[0,\"\\n\\t\\t\"],[6,\"span\"],[10,\"class\",[26,[\"post-tag \",[25,\"category-tag-class\",[[19,0,[\"model\",\"article\",\"tag\"]]],null]]]],[7],[0,\"\\n\\t\\t\\t\"],[6,\"a\"],[10,\"href\",[26,[[25,\"category-href\",[[19,0,[\"model\",\"article\",\"tag\"]]],null]]]],[7],[0,\"\\n\\t\\t\\t\\t\"],[1,[25,\"category-tag\",[[19,0,[\"model\",\"article\",\"tag\"]]],null],false],[0,\"\\n\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\"],[8],[0,\"\\n\\n\\t\\t\"],[6,\"figure\"],[10,\"style\",[26,[\"background-image: url(\",[18,\"serverURL\"],\"storage/articles/\",[20,[\"model\",\"article\",\"image\"]],\")\"]]],[7],[0,\"\\n\\t\\t\\t\"],[6,\"img\"],[10,\"src\",[26,[[18,\"serverURL\"],\"storage/articles/\",[20,[\"model\",\"article\",\"image\"]]]]],[9,\"class\",\"desktop-hide\"],[9,\"alt\",\"\"],[7],[8],[0,\"\\n\\t\\t\"],[8],[0,\"\\n\\t\"],[8],[0,\"\\n\\n\\t\"],[6,\"div\"],[9,\"class\",\"page-article-content\"],[7],[0,\"\\n\\n\\t\\t\"],[6,\"div\"],[9,\"class\",\"article-heading\"],[7],[0,\"\\n\\t\\t\\t\"],[6,\"h1\"],[9,\"class\",\"article-title\"],[7],[1,[20,[\"model\",\"article\",\"title\"]],false],[8],[0,\"\\n\\t\\t\\t\"],[6,\"svg\"],[9,\"viewBox\",\"0 0 51 35.7\"],[9,\"class\",\"icon\"],[7],[0,\"\\n\\t\\t\\t\\t\"],[6,\"rect\"],[9,\"class\",\"st0\"],[9,\"width\",\"51\"],[9,\"height\",\"8.7\"],[7],[8],[0,\"\\n\\t\\t\\t\\t\"],[6,\"rect\"],[9,\"y\",\"27\"],[9,\"class\",\"st0\"],[9,\"width\",\"51\"],[9,\"height\",\"8.7\"],[7],[8],[0,\"\\n\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\"],[8],[0,\"\\n\\n\\t\\t\"],[6,\"div\"],[9,\"class\",\"article-body\"],[7],[0,\"\\n\\n\\t\\t\\t\"],[6,\"article\"],[7],[0,\"\\n\\t\\t\\t\\t\"],[1,[25,\"article-meta\",null,[[\"model\"],[[19,0,[\"model\"]]]]],false],[0,\"\\n\\t\\t\\t\\t\"],[1,[25,\"article-author-content\",null,[[\"article\"],[[19,0,[\"model\",\"article\"]]]]],false],[0,\"\\n\\t\\t\\t\\t\"],[1,[25,\"article-challenges\",null,[[\"model\"],[[19,0,[\"model\"]]]]],false],[0,\"\\n\\t\\t\\t\\t\"],[1,[25,\"article-comments\",null,[[\"model\"],[[19,0,[\"model\"]]]]],false],[0,\"\\n\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\\n\\t\\t\\t\"],[1,[25,\"article-aside\",null,[[\"model\"],[[19,0,[\"model\"]]]]],false],[0,\"\\n\\n\\t\\t\"],[8],[2,\" article-body \"],[0,\"\\n\\n\\t\"],[8],[2,\" parge-article-content \"],[0,\"\\n\\n\\t\"],[6,\"div\"],[9,\"class\",\"join\"],[7],[0,\"\\n\\t\\t\"],[6,\"div\"],[9,\"class\",\"join-text\"],[7],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[6,\"strong\"],[7],[0,\"Join our community\"],[8],[0,\" of inspiring stories, creative minds and far off worlds\"],[8],[0,\"\\n\\t\\t\"],[8],[0,\"\\n\\t\\t\"],[6,\"div\"],[9,\"class\",\"join-form\"],[7],[0,\"\\n\\t\\t\\t\"],[4,\"link-to\",[\"register\"],[[\"class\"],[\"register\"]],{\"statements\":[[6,\"span\"],[9,\"class\",\"button button-orange\"],[7],[0,\"Register\"],[8]],\"parameters\":[]},null],[0,\"\\n\\t\\t\"],[8],[0,\"\\n\\t\"],[8],[0,\"\\n\\n\"],[8],[0,\"\\n\\n\\n\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/article.hbs" } });
});
define("frontend/templates/article/gallery", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "sRFno2Ub", "block": "{\"symbols\":[\"submission\",\"index\"],\"statements\":[[6,\"section\"],[9,\"id\",\"article-gallery\"],[7],[0,\"\\n\\t\\n\\t\"],[6,\"div\"],[9,\"class\",\"article-wrap\"],[7],[0,\"\\n\\t\\n\\t\\t\"],[6,\"div\"],[9,\"class\",\"article-heading\"],[7],[6,\"h1\"],[9,\"class\",\"article-title\"],[7],[1,[20,[\"model\",\"article\",\"title\"]],false],[0,\" Gallery\"],[8],[8],[0,\"\\n\\n\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"article-meta\"],[7],[0,\"\\n\\t\\t\\t\\t\"],[6,\"span\"],[9,\"class\",\"article-icon\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\"],[6,\"svg\"],[9,\"viewBox\",\"0 0 11.05 16.8\"],[7],[6,\"polyline\"],[9,\"points\",\"8.6,15.5 1.2,8.2 8.6,1.2\"],[7],[8],[8],[0,\"\\n\\t\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\\t\"],[4,\"link-to\",[\"article\",[19,0,[\"model\",\"article\",\"id\"]]],null,{\"statements\":[[0,\" Back to the Challenge \"]],\"parameters\":[]},null],[0,\"\\n\\t\\t\\t\\t\"],[6,\"button\"],[9,\"id\",\"button-show-upload\"],[9,\"type\",\"button\"],[9,\"class\",\"button button-blue\"],[3,\"action\",[[19,0,[]],\"showGallerySubmission\"]],[7],[0,\"Create Your Submission\"],[8],[0,\"\\n\\t\\t\\t\\t\"],[1,[25,\"challenge-submit\",null,[[\"model\"],[[19,0,[\"model\"]]]]],false],[0,\"\\n\\t\\t\\t\"],[8],[0,\"\\n\\n\"],[4,\"if\",[[25,\"eq\",[[19,0,[\"model\",\"article\",\"submissionType\"]],\"Photo\"],null]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\n\"],[0,\"\\t\\t\\t\\t\"],[1,[25,\"log\",[[19,0,[\"model\"]]],null],false],[0,\"\\n\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"challenge-submissions\"],[7],[0,\"\\n\"],[4,\"each\",[[19,0,[\"model\",\"article\",\"submissions\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\\t\"],[1,[25,\"challenge-submission\",null,[[\"articleID\",\"submission\",\"session\",\"store\"],[[19,0,[\"model\",\"article\",\"id\"]],[19,1,[]],[19,0,[\"model\",\"session\"]],[19,0,[\"model\",\"store\"]]]]],false],[0,\"\\n\"]],\"parameters\":[1,2]},null],[0,\"\\t\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\\t\\n\"],[0,\"\\t\\t\\t\\t\\t\\n\"],[0,\"\\t\\t\\t\\t\\n\"]],\"parameters\":[]},null],[0,\"\\n\\t\\t\"],[8],[2,\" article-wrap \"],[0,\"\\n\\n\"],[0,\"\\n\\n\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/article/gallery.hbs" } });
});
define("frontend/templates/articles", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "JBlTDDGZ", "block": "{\"symbols\":[\"pagination\",\"index\",\"article\",\"index\"],\"statements\":[[6,\"section\"],[9,\"class\",\"page-article-categories\"],[7],[0,\"\\n\\t\"],[6,\"div\"],[9,\"class\",\"page-articles-container\"],[7],[0,\"\\n\\t\\t\"],[6,\"div\"],[9,\"class\",\"page-articles-wrap\"],[7],[0,\"\\n\"],[4,\"each\",[[19,0,[\"model\",\"articles\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"page-articles-row\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"post\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"post-thumb\"],[7],[0,\"\\n\"],[4,\"link-to\",[\"article\",[19,3,[\"articleID\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\\t\\t\\t\"],[6,\"figure\"],[10,\"style\",[26,[\"background-image: url(\",[18,\"serverURL\"],\"storage/articles/\",[19,3,[\"articleImage\"]],\")\"]]],[7],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\t\\t\\t\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"post-text\"],[7],[0,\"\\n\"],[4,\"link-to\",[\"article\",[19,3,[\"articleID\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\\t\\t\\t\"],[6,\"h3\"],[7],[1,[19,3,[\"articleTitle\"]],false],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\t\\t\\t\\t\\t\\t\\t\"],[6,\"p\"],[7],[1,[25,\"short-desc\",[[19,3,[\"articleDescription\"]]],[[\"len\"],[\"200\"]]],true],[0,\" \"],[8],[0,\"\\n\\t\\t\\t\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\\t\"],[8],[0,\"\\n\"]],\"parameters\":[3,4]},null],[0,\"\\t\\t\"],[8],[0,\"\\n\\n\"],[4,\"each\",[[19,0,[\"model\",\"pagination\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\"],[6,\"ul\"],[9,\"class\",\"pagination\"],[7],[0,\"\\n\"],[4,\"if\",[[25,\"gt\",[[19,1,[\"page\"]],1],null]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\"],[6,\"button\"],[9,\"class\",\"button button-teal\"],[3,\"action\",[[19,0,[]],\"prevPage\"]],[7],[0,\"Prev\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[25,\"lt\",[[19,1,[\"page\"]],[19,1,[\"total_pages\"]]],null]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\"],[6,\"button\"],[9,\"class\",\"button button-teal\"],[3,\"action\",[[19,0,[]],\"nextPage\"]],[7],[0,\"Next\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\t\\t\\t\"],[8],[0,\"\\n\"]],\"parameters\":[1,2]},null],[0,\"\\t\"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/articles.hbs" } });
});
define("frontend/templates/challenges", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "8W6ffJcv", "block": "{\"symbols\":[\"pagination\",\"index\",\"article\",\"index\"],\"statements\":[[6,\"section\"],[9,\"class\",\"page-article-categories\"],[7],[0,\"\\n\\t\"],[6,\"div\"],[9,\"class\",\"page-articles-container\"],[7],[0,\"\\n\\t\\t\"],[6,\"div\"],[9,\"class\",\"page-articles-wrap\"],[7],[0,\"\\n\"],[4,\"each\",[[19,0,[\"model\",\"articles\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"page-articles-row\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"post\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"post-thumb\"],[7],[0,\"\\n\"],[4,\"link-to\",[\"article\",[19,3,[\"articleID\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\\t\\t\\t\"],[6,\"figure\"],[10,\"style\",[26,[\"background-image: url(\",[18,\"serverURL\"],\"storage/articles/\",[19,3,[\"articleImage\"]],\")\"]]],[7],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\t\\t\\t\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"post-text\"],[7],[0,\"\\n\"],[4,\"link-to\",[\"article\",[19,3,[\"articleID\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\\t\\t\\t\"],[6,\"h3\"],[7],[1,[19,3,[\"articleTitle\"]],false],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\t\\t\\t\\t\\t\\t\\t\"],[6,\"p\"],[7],[1,[25,\"short-desc\",[[19,3,[\"articleDescription\"]]],[[\"len\"],[\"200\"]]],true],[0,\" \"],[8],[0,\"\\n\\t\\t\\t\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\\t\"],[8],[0,\"\\n\"]],\"parameters\":[3,4]},null],[0,\"\\t\\t\"],[8],[0,\"\\n\"],[4,\"each\",[[19,0,[\"model\",\"pagination\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\"],[6,\"ul\"],[9,\"class\",\"pagination\"],[7],[0,\"\\n\"],[4,\"if\",[[25,\"gt\",[[19,1,[\"page\"]],1],null]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\"],[6,\"button\"],[9,\"class\",\"button button-teal\"],[3,\"action\",[[19,0,[]],\"prevPage\"]],[7],[0,\"Prev\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[25,\"lt\",[[19,1,[\"page\"]],[19,1,[\"total_pages\"]]],null]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\"],[6,\"button\"],[9,\"class\",\"button button-teal\"],[3,\"action\",[[19,0,[]],\"nextPage\"]],[7],[0,\"Next\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\t\\t\\t\"],[8],[0,\"\\n\"]],\"parameters\":[1,2]},null],[0,\"\\t\"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/challenges.hbs" } });
});
define("frontend/templates/change-password", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "b2Oir9MJ", "block": "{\"symbols\":[],\"statements\":[[6,\"section\"],[9,\"id\",\"page-register-login\"],[9,\"class\",\"change-password\"],[7],[0,\"\\n\\t\"],[6,\"div\"],[9,\"class\",\"form\"],[7],[0,\"\\n\\t\\t\"],[6,\"h2\"],[7],[0,\"Change Password\"],[8],[0,\"\\n\\t\\t\"],[6,\"form\"],[7],[0,\"\\n\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"form-input\"],[7],[0,\"\\n\\t\\t\\t\\t\"],[1,[25,\"input\",null,[[\"value\",\"type\",\"placeholder\"],[[19,0,[\"oldPassword\"]],\"password\",\"Old Password\"]]],false],[0,\"\\n\\t\\t\\t\\t\"],[1,[25,\"display-errors\",null,[[\"errors\",\"showErrors\",\"class\"],[[19,0,[\"errors\",\"oldPassword\"]],[19,0,[\"showErrors\"]],\"form-error\"]]],false],[0,\" \\n\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"form-input\"],[7],[0,\"\\n\\t\\t\\t\\t\"],[1,[25,\"input\",null,[[\"value\",\"type\",\"placeholder\"],[[19,0,[\"newPassword\"]],\"password\",\"New Password\"]]],false],[0,\"\\n\\t\\t\\t\\t\"],[1,[25,\"display-errors\",null,[[\"errors\",\"showErrors\"],[[19,0,[\"errors\",\"newPassword\"]],[19,0,[\"showErrors\"]]]]],false],[0,\" \\n\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"form-input\"],[7],[0,\"\\n\\t\\t\\t\\t\"],[1,[25,\"input\",null,[[\"value\",\"type\",\"placeholder\"],[[19,0,[\"newPasswordConfirmation\"]],\"password\",\"Retype New Password\"]]],false],[0,\"\\n\\t\\t\\t\\t\"],[1,[25,\"display-errors\",null,[[\"errors\",\"showErrors\"],[[19,0,[\"errors\",\"newPasswordConfirmation\"]],[19,0,[\"showErrors\"]]]]],false],[0,\" \\n\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"button\"],[3,\"action\",[[19,0,[]],\"change\"]],[7],[6,\"span\"],[9,\"class\",\"button button-teal\"],[7],[0,\"Change Password\"],[8],[8],[0,\"\\n\\t\\t\"],[8],[0,\"\\n\\t\"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"flash-messages\"],[7],[0,\"\\n\"],[2,\"\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/change-password.hbs" } });
});
define("frontend/templates/components/article-aside", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "/JeYdpVd", "block": "{\"symbols\":[\"related\",\"index\",\"&default\"],\"statements\":[[11,3],[0,\"\\n\"],[6,\"h2\"],[9,\"class\",\"post-aside-title\"],[9,\"mobile\",\"\"],[7],[0,\"More from 8th Mind\"],[8],[0,\"\\n\"],[4,\"each\",[[19,0,[\"model\",\"related\"]]],null,{\"statements\":[[4,\"if\",[[25,\"lt\",[[19,2,[]],3],null]],null,{\"statements\":[[0,\"\\t\\t\"],[1,[25,\"article-post\",null,[[\"article\"],[[19,1,[]]]]],false],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[1,2]},null]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/components/article-aside.hbs" } });
});
define("frontend/templates/components/article-author-content", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "hLa8ugNA", "block": "{\"symbols\":[],\"statements\":[[1,[20,[\"article\",\"body\"]],true],[0,\"\\n\"],[1,[18,\"yeild\"],false]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/components/article-author-content.hbs" } });
});
define("frontend/templates/components/article-challenges", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "HCtwihXa", "block": "{\"symbols\":[\"submission\",\"index\",\"&default\"],\"statements\":[[4,\"if\",[[19,0,[\"model\",\"article\",\"allowGallery\"]]],null,{\"statements\":[[0,\"\\n\\t\"],[6,\"div\"],[9,\"class\",\"challenge-submissions\"],[7],[0,\"\\n\\n\"],[4,\"if\",[[25,\"eq\",[[19,0,[\"model\",\"article\",\"submissionType\"]],\"Photo\"],null]],null,{\"statements\":[[0,\"\\n\"],[4,\"each\",[[19,0,[\"model\",\"article\",\"submissions\"]]],null,{\"statements\":[[0,\"\\n\"],[4,\"if\",[[25,\"gt\",[[19,2,[]],2],null]],null,{\"statements\":[[0,\"\\n\\t\\t\\t\\t\\t\"],[1,[25,\"challenge-submission\",null,[[\"submission\",\"session\"],[[19,1,[]],[19,0,[\"model\",\"session\"]]]]],false],[0,\"\\n\\t\\t\\t\\t\\t\\n\"]],\"parameters\":[]},null]],\"parameters\":[1,2]},null]],\"parameters\":[]},null],[0,\"\\n\\t\"],[8],[0,\"\\n\\n\"],[4,\"link-to\",[\"article.gallery\",[19,0,[\"model\",\"article\",\"articleID\"]]],null,{\"statements\":[[0,\"\\t\\t\"],[6,\"button\"],[7],[0,\"View All\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"if\",[[19,0,[\"model\",\"article\",\"allowSubmission\"]]],null,{\"statements\":[[0,\"\\n\\t\"],[1,[25,\"article-countdown-timer\",null,[[\"article\"],[[19,0,[\"model\",\"article\"]]]]],false],[0,\"\\n\"],[4,\"link-to\",[\"article.gallery\",[19,0,[\"model\",\"article\",\"articleID\"]]],null,{\"statements\":[[0,\"\\t\\t\"],[6,\"button\"],[9,\"class\",\"button button-orange\"],[7],[0,\"Submit Your Entry\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[11,3]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/components/article-challenges.hbs" } });
});
define("frontend/templates/components/article-comments", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "IQbumDf0", "block": "{\"symbols\":[\"&default\"],\"statements\":[[4,\"if\",[[19,0,[\"model\",\"article\",\"allowComment\"]]],null,{\"statements\":[[0,\"\\n\\t\"],[6,\"hr\"],[7],[8],[0,\"\\n\\n\\t\"],[6,\"div\"],[9,\"id\",\"disqus_thread\"],[7],[8],[0,\"\\n\\t\"],[6,\"script\"],[7],[0,\"\\n\\n\\t\\tvar disqus_config = function () {\\n\\t\\t\\tthis.page.url = window.location.href;\\n\\t\\t\\tthis.page.identifier = window.location.pathname;\\n\\t\\t};\\n\\t\\t// DON'T EDIT BELOW THIS LINE\\n\\t\\t(function() {\\n\\t\\t\\tvar d = document, s = d.createElement('script');\\n\\t\\t\\t\\ts.src = 'https://8thmind.disqus.com/embed.js';\\n\\t\\t\\t\\ts.setAttribute('data-timestamp', +new Date());\\n\\t\\t\\t\\t(d.head || d.body).appendChild(s);\\n\\t\\t})();\\n\\t\"],[8],[0,\"\\n\\t\"],[6,\"noscript\"],[7],[0,\"\\n\\t\\tPlease enable JavaScript to view the \"],[6,\"a\"],[9,\"href\",\"https://disqus.com/?ref_noscript\"],[7],[0,\"comments powered by Disqus.\"],[8],[0,\"\\n\\t\"],[8],[0,\"\\n\\n\"]],\"parameters\":[]},null],[11,1]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/components/article-comments.hbs" } });
});
define("frontend/templates/components/article-countdown-timer", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "zcz0I28D", "block": "{\"symbols\":[\"&default\"],\"statements\":[[6,\"h4\"],[9,\"class\",\"post-aside-title\"],[7],[11,1],[0,\" Time Remaining\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"countdown-timer\"],[7],[0,\"\\n\\t\"],[6,\"p\"],[9,\"class\",\"countdown-timer-row\"],[7],[6,\"strong\"],[7],[1,[18,\"days\"],false],[8],[0,\" Days\"],[8],[0,\"\\n\\t\"],[6,\"p\"],[9,\"class\",\"countdown-timer-row\"],[7],[6,\"strong\"],[7],[1,[18,\"hours\"],false],[8],[0,\" Hours\"],[8],[0,\"\\n\\t\"],[6,\"p\"],[9,\"class\",\"countdown-timer-row\"],[7],[6,\"strong\"],[7],[1,[18,\"minutes\"],false],[8],[0,\" Minutes\"],[8],[0,\"\\n\\t\"],[6,\"p\"],[9,\"class\",\"countdown-timer-row\"],[7],[6,\"strong\"],[7],[1,[18,\"seconds\"],false],[8],[0,\" Seconds\"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/components/article-countdown-timer.hbs" } });
});
define("frontend/templates/components/article-meta", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "aBjRYb5k", "block": "{\"symbols\":[],\"statements\":[[4,\"if\",[[19,0,[\"model\",\"article\",\"allowSubmission\"]]],null,{\"statements\":[[0,\"\\n\\t\"],[6,\"div\"],[9,\"class\",\"article-meta-text article-challenge-date\"],[7],[0,\"\\n\\t\\t\"],[6,\"span\"],[9,\"class\",\"article-icon\"],[7],[6,\"svg\"],[9,\"viewBox\",\"0 0 11.05 16.8\"],[7],[6,\"polyline\"],[9,\"points\",\"1.22 1.22 8.58 8.58 1.22 15.54\"],[7],[8],[8],[8],[0,\"\\n\\t\\t\"],[6,\"div\"],[9,\"class\",\"article-challenge-label\"],[7],[6,\"span\"],[7],[0,\"Starts\"],[8],[0,\" \"],[1,[25,\"moment-format\",[[19,0,[\"model\",\"article\",\"dateStart\"]],\"MMMM Do YYYY\"],null],false],[8],[0,\"\\n\\t\\t\"],[6,\"div\"],[9,\"class\",\"article-challenge-label\"],[7],[6,\"span\"],[7],[0,\"Ends\"],[8],[0,\" \"],[1,[25,\"moment-format\",[[19,0,[\"model\",\"article\",\"dateEndVoting\"]],\"MMMM Do YYYY\"],null],false],[8],[0,\"\\n\\t\"],[8],[0,\"\\n\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"\\n\\t\"],[6,\"div\"],[9,\"class\",\"article-meta-text article-author\"],[7],[0,\"\\n\\t\\t\"],[6,\"span\"],[9,\"class\",\"article-icon\"],[7],[6,\"svg\"],[9,\"viewBox\",\"0 0 11.05 16.8\"],[7],[6,\"polyline\"],[9,\"points\",\"1.22 1.22 8.58 8.58 1.22 15.54\"],[7],[8],[8],[8],[0,\"\\n\\t\\t\"],[6,\"span\"],[7],[0,\"By \"],[1,[25,\"change-author-name\",[[19,0,[\"model\",\"article\",\"articleID\"]],22,23],null],false],[8],[0,\"\\n\\t\"],[8],[0,\"\\n\\n\"]],\"parameters\":[]}],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"article-social-media\"],[7],[0,\"\\n\\n\\t\"],[4,\"fb-share-button\",null,[[\"url\"],[[19,0,[\"model\",\"article\",\"url\"]]]],{\"statements\":[[0,\"Share\"]],\"parameters\":[]},null],[0,\"\\n\\t\"],[4,\"twitter-share-button\",null,[[\"url\",\"hastag\",\"title\",\"text\"],[[19,0,[\"model\",\"article\",\"url\"]],\"#8thMind\",[19,0,[\"model\",\"article\",\"title\"]],[19,0,[\"model\",\"article\",\"body\"]]]],{\"statements\":[[0,\"Tweet\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/components/article-meta.hbs" } });
});
define("frontend/templates/components/article-post", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "a8U5dkSw", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"post-thumb\"],[7],[0,\"\\n\\n\"],[4,\"if\",[[19,0,[\"article\",\"tag\"]]],null,{\"statements\":[[0,\"\\t\\t\"],[6,\"span\"],[10,\"class\",[26,[\"post-tag \",[25,\"category-tag-class\",[[19,0,[\"article\",\"tag\"]]],null]]]],[7],[0,\"\\n\\t\\t\\t\"],[6,\"a\"],[10,\"href\",[26,[[25,\"category-href\",[[19,0,[\"article\",\"tag\"]]],null]]]],[7],[1,[25,\"category-tag\",[[19,0,[\"article\",\"tag\"]]],null],false],[8],[0,\"\\n\\t\\t\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"link-to\",[\"article\",[19,0,[\"article\",\"articleID\"]]],null,{\"statements\":[[0,\"\\t\\t\"],[6,\"figure\"],[10,\"style\",[26,[\"background-image: url(\",[18,\"serverURL\"],\"storage/articles/\",[20,[\"article\",\"image\"]],\")\"]]],[7],[8],[0,\"\\n\"]],\"parameters\":[]},null],[8],[0,\"\\n\\n\"],[4,\"if\",[[19,0,[\"article\",\"tag\"]]],null,{\"statements\":[[0,\"\\t\"],[6,\"span\"],[9,\"class\",\"post-type\"],[7],[0,\"\\n\\t\\t\"],[6,\"a\"],[10,\"href\",[26,[[25,\"category-href\",[[19,0,[\"article\",\"tag\"]]],null]]]],[7],[0,\"\\n\\t\\t\\t\"],[1,[25,\"category-view-all-text\",[[19,0,[\"article\",\"tag\"]]],null],false],[0,\"\\n\\t\\t\"],[8],[0,\"\\n\\t\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[6,\"span\"],[9,\"class\",\"post-author\"],[9,\"desktop\",\"\"],[7],[0,\"By \"],[1,[25,\"change-author-name\",[[19,0,[\"article\",\"articleID\"]],22,23],null],false],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"post-text\"],[7],[0,\"\\n\\t\"],[6,\"h2\"],[9,\"class\",\"post-title\"],[7],[0,\"\\n\"],[4,\"link-to\",[\"article\",[19,0,[\"article\",\"articleID\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\"],[1,[20,[\"article\",\"title\"]],false],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\t\"],[8],[0,\"\\n\\t\\n\"],[4,\"if\",[[19,0,[\"article\",\"body\"]]],null,{\"statements\":[[0,\"\\t\\t\"],[6,\"p\"],[9,\"class\",\"post-desc\"],[7],[1,[25,\"short-desc\",[[19,0,[\"article\",\"body\"]]],[[\"len\"],[\"140\"]]],true],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\t\\n\\t\"],[6,\"span\"],[9,\"class\",\"post-author\"],[9,\"mobile\",\"\"],[7],[0,\"By \"],[1,[25,\"change-author-name\",[[19,0,[\"article\",\"articleID\"]],22,23],null],false],[8],[0,\"\\n\\t\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/components/article-post.hbs" } });
});
define("frontend/templates/components/challenge-submission", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "UNy6ypyX", "block": "{\"symbols\":[\"asset\",\"&default\"],\"statements\":[[6,\"div\"],[9,\"class\",\"challenge-submission-images\"],[7],[0,\"\\n\\t\\n\"],[0,\"\\n\"],[4,\"each\",[[19,0,[\"submission\",\"assets\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"challenge-submission-img\"],[10,\"data-asset-id\",[19,1,[\"id\"]],null],[7],[0,\"\\n\"],[4,\"if\",[[19,0,[\"session\",\"success\"]]],null,{\"statements\":[[4,\"if\",[[25,\"eq\",[[19,0,[\"submission\",\"userID\"]],[19,0,[\"session\",\"userID\"]]],null]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"challenge-submission-edit\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\\t\\t\"],[6,\"button\"],[9,\"class\",\"delete\"],[3,\"action\",[[19,0,[]],\"deleteAsset\",[19,0,[\"articleID\"]],[19,0,[\"submission\",\"id\"]],[19,1,[\"id\"]],[19,0,[\"store\"]]]],[7],[0,\"Delete\"],[8],[0,\"\\n\\t\\t\\t\\t\\t\\t\"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]},null],[0,\"\\t\\t\\t\\t\"],[1,[25,\"light-box\",null,[[\"href\",\"data-lightbox\",\"data-title\"],[[19,1,[\"image\"]],[19,0,[\"submission\",\"id\"]],[19,1,[\"caption\"]]]]],false],[0,\"\\n\\t\\t\\t\"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"\\n\\t\\n\"],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"challenge-submission-data\"],[7],[0,\"\\n\\t\"],[6,\"div\"],[9,\"class\",\"challenge-submission-title\"],[7],[0,\"\\n\\t\\t\"],[6,\"h2\"],[7],[1,[25,\"short-desc\",[[19,0,[\"submission\",\"title\"]]],[[\"len\"],[\"28\"]]],false],[8],[0,\"\\n\\t\"],[8],[0,\"\\n\\t\"],[6,\"div\"],[9,\"class\",\"challenge-submission-username\"],[7],[0,\"\\n\\t\\t\"],[6,\"p\"],[7],[1,[20,[\"submission\",\"name\"]],false],[8],[0,\"\\n\\t\"],[8],[0,\"\\n\\t\"],[6,\"div\"],[9,\"class\",\"challenge-submission-upvote\"],[7],[0,\"\\n\"],[4,\"if\",[[25,\"eq\",[[19,0,[\"article\",\"upVoting\"]]],null]],null,{\"statements\":[[4,\"if\",[[19,0,[\"session\",\"success\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\"],[6,\"span\"],[9,\"class\",\"upvote-counter\"],[10,\"data-submission-id\",[26,[[20,[\"gallery\",\"id\"]]]]],[3,\"action\",[[19,0,[]],\"handleUpvote\",[19,0,[\"gallery\",\"id\"]],[19,0,[\"model\",\"article\",\"id\"]]]],[7],[0,\"\\n\\t\\t\\t\\t\\t\"],[1,[20,[\"gallery\",\"upVotes\"]],false],[0,\"\\n\\t\\t\\t\\t\\t\"],[6,\"i\"],[9,\"class\",\"icon-heart\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\\t\"],[6,\"svg\"],[9,\"viewBox\",\"0 0 96.6 85.1\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\\t\\t\"],[6,\"path\"],[9,\"class\",\"icon-sprite\"],[9,\"d\",\"M96.6,26.5C96.6,11.9,84.7,0,70.1,0c-8.8,0-16.7,4.3-21.5,11l0,0l0,0C43.8,4.3,36,0,27.1,0\\n\\t\\t\\t\\t\\t\\t\\tC12.5,0,0.6,11.9,0.6,26.5c0,7.9,3.5,15,8.9,19.8l39.1,38.8l39.4-39l0,0C93.3,41.2,96.6,34.3,96.6,26.5z\"],[7],[8],[0,\"\\n\\t\\t\\t\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\\t\"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[4,\"link-to\",[\"login\"],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\"],[6,\"span\"],[9,\"class\",\"upvote-counter\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\\t\"],[1,[20,[\"gallery\",\"upVotes\"]],false],[0,\"\\n\\t\\t\\t\\t\\t\\t\"],[6,\"i\"],[9,\"class\",\"icon-heart\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\\t\\t\"],[6,\"svg\"],[9,\"viewBox\",\"0 0 96.6 85.1\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\"],[6,\"path\"],[9,\"class\",\"icon-sprite\"],[9,\"d\",\"M96.6,26.5C96.6,11.9,84.7,0,70.1,0c-8.8,0-16.7,4.3-21.5,11l0,0l0,0C43.8,4.3,36,0,27.1,0\\n\\t\\t\\t\\t\\t\\t\\t\\tC12.5,0,0.6,11.9,0.6,26.5c0,7.9,3.5,15,8.9,19.8l39.1,38.8l39.4-39l0,0C93.3,41.2,96.6,34.3,96.6,26.5z\"],[7],[8],[0,\"\\n\\t\\t\\t\\t\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\\t\\t\"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]}]],\"parameters\":[]},null],[0,\"\\t\"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[11,2]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/components/challenge-submission.hbs" } });
});
define("frontend/templates/components/challenge-submit", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "T85crCAM", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1],[0,\"\\n\"],[6,\"form\"],[9,\"id\",\"add-submission\"],[9,\"method\",\"POST\"],[7],[0,\"\\n\\t\"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n\\t\\t\"],[6,\"label\"],[9,\"for\",\"submissionTitle\"],[7],[0,\"Title\"],[8],[0,\"\\n\\t\\t\"],[1,[25,\"input\",null,[[\"name\",\"type\",\"id\"],[\"submissionTitle\",\"text\",\"submissionTitle\"]]],false],[0,\"\\n\\t\"],[8],[0,\"\\n\\t\"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n\\t\\t\"],[6,\"label\"],[9,\"for\",\"caption\"],[7],[0,\"Caption\"],[8],[0,\"\\n\\t\\t\"],[1,[25,\"input\",null,[[\"name\",\"type\",\"id\"],[\"caption\",\"text\",\"caption\"]]],false],[0,\"\\n\\t\"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"form\"],[9,\"id\",\"add-asset\"],[9,\"method\",\"POST\"],[7],[0,\"\\n\\t\"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n\\t\\t\"],[6,\"label\"],[9,\"for\",\"assetFile\"],[7],[0,\"File Upload\"],[8],[0,\"\\n\\t\\t\"],[1,[25,\"input\",null,[[\"name\",\"type\",\"id\"],[\"assetFile\",\"file\",\"assetFile\"]]],false],[0,\"\\n\\t\"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"button\"],[9,\"id\",\"button-submit\"],[9,\"type\",\"button\"],[9,\"class\",\"button button-teal hidden\"],[3,\"action\",[[19,0,[]],\"create\",[19,0,[\"model\",\"article\",\"id\"]]]],[7],[0,\"Submit\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/components/challenge-submit.hbs" } });
});
define("frontend/templates/components/display-errors", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "wg52vG1j", "block": "{\"symbols\":[\"error\"],\"statements\":[[4,\"if\",[[19,0,[\"showErrors\"]]],null,{\"statements\":[[4,\"each\",[[19,0,[\"errors\"]]],null,{\"statements\":[[0,\"    \"],[6,\"p\"],[9,\"style\",\"color: red;\"],[7],[1,[19,1,[]],false],[8],[0,\"\\n\"]],\"parameters\":[1]},null]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/components/display-errors.hbs" } });
});
define("frontend/templates/components/isotope-grid", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "B6TDSg4Q", "block": "{\"symbols\":[\"&default\"],\"statements\":[[11,1]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/components/isotope-grid.hbs" } });
});
define("frontend/templates/create", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "bNYD8WrG", "block": "{\"symbols\":[\"pagination\",\"index\",\"article\",\"index\"],\"statements\":[[6,\"section\"],[9,\"class\",\"page-article-categories\"],[7],[0,\"\\n\\t\"],[6,\"div\"],[9,\"class\",\"page-articles-container\"],[7],[0,\"\\n\\t\\t\"],[6,\"div\"],[9,\"class\",\"page-articles-wrap\"],[7],[0,\"\\n\"],[4,\"each\",[[19,0,[\"model\",\"articles\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"page-articles-row\"],[7],[0,\"\\n\\n\\t\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"post\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"post-thumb\"],[7],[0,\"\\n\"],[4,\"link-to\",[\"article\",[19,3,[\"articleID\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\\t\\t\\t\"],[6,\"figure\"],[10,\"style\",[26,[\"background-image: url(\",[18,\"serverURL\"],\"storage/articles/\",[19,3,[\"articleImage\"]],\")\"]]],[7],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\t\\t\\t\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"post-text\"],[7],[0,\"\\n\"],[4,\"link-to\",[\"article\",[19,3,[\"articleID\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\\t\\t\\t\"],[6,\"h3\"],[7],[1,[19,3,[\"articleTitle\"]],false],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\t\\t\\t\\t\\t\\t\\t\"],[6,\"p\"],[7],[1,[25,\"short-desc\",[[19,3,[\"articleDescription\"]]],[[\"len\"],[\"500\"]]],true],[0,\" \"],[8],[0,\"\\n\\t\\t\\t\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\\t\\t\"],[8],[0,\"\\n\\n\\t\\t\\t\\t\"],[8],[0,\"\\n\"]],\"parameters\":[3,4]},null],[0,\"\\t\\t\"],[8],[0,\"\\n\\t\\t\\n\\n\"],[4,\"each\",[[19,0,[\"model\",\"pagination\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\"],[6,\"ul\"],[9,\"class\",\"pagination\"],[7],[0,\"\\n\"],[4,\"if\",[[25,\"gt\",[[19,1,[\"page\"]],1],null]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\"],[6,\"button\"],[9,\"class\",\"button button-teal\"],[3,\"action\",[[19,0,[]],\"prevPage\"]],[7],[0,\"Prev\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[25,\"lt\",[[19,1,[\"page\"]],[19,1,[\"total_pages\"]]],null]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\"],[6,\"button\"],[9,\"class\",\"button button-teal\"],[3,\"action\",[[19,0,[]],\"nextPage\"]],[7],[0,\"Next\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\t\\t\\t\"],[8],[0,\"\\n\"]],\"parameters\":[1,2]},null],[0,\"\\t\"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/create.hbs" } });
});
define("frontend/templates/forget-password", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "FbTUWb0e", "block": "{\"symbols\":[],\"statements\":[[6,\"section\"],[9,\"id\",\"page-register-login\"],[9,\"class\",\"forget-password\"],[7],[0,\"\\n\\t\"],[6,\"div\"],[9,\"class\",\"form\"],[7],[0,\"\\n\\t\\t\"],[6,\"h2\"],[7],[0,\"Forgot Password\"],[8],[0,\"\\n\\t\\t\"],[6,\"p\"],[7],[0,\"Enter your email to recover your password\"],[8],[0,\"\\n\\t\\t\"],[6,\"form\"],[7],[0,\"\\n\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"form-input\"],[7],[0,\"\\n\\t\\t\\t\\t\"],[1,[25,\"input\",null,[[\"value\",\"type\",\"placeholder\"],[[19,0,[\"email\"]],\"email\",\"Email\"]]],false],[0,\"\\n\\t\\t\\t\\t\"],[1,[25,\"display-errors\",null,[[\"errors\",\"showErrors\",\"class\"],[[19,0,[\"errors\",\"email\"]],[19,0,[\"showErrors\"]],\"form-error\"]]],false],[0,\"\\n\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"button\"],[3,\"action\",[[19,0,[]],\"forget\"]],[7],[6,\"span\"],[9,\"class\",\"button button-teal\"],[7],[0,\"Recover Password\"],[8],[8],[0,\"\\n\\t\\t\"],[8],[0,\"\\t\\t\\n\\t\"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/forget-password.hbs" } });
});
define("frontend/templates/gallery", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "qLMiO9Qy", "block": "{\"symbols\":[\"pagination\",\"index\",\"gallery\",\"index\"],\"statements\":[[6,\"section\"],[9,\"id\",\"page-gallery\"],[7],[0,\"\\n\\n\\t\"],[6,\"div\"],[9,\"class\",\"gallery-container\"],[7],[0,\"\\n\\t\\t\"],[6,\"div\"],[9,\"class\",\"page-article-hero\"],[7],[0,\"\\n\\t\\t\\t\"],[6,\"figure\"],[10,\"style\",[26,[\"background-image: url(\",[18,\"serverURL\"],\"storage/articles/\",[20,[\"model\",\"article\",\"image\"]],\")\"]]],[7],[0,\"\\n\\t\\t\\t\\t\"],[6,\"img\"],[10,\"src\",[26,[[18,\"serverURL\"],\"storage/articles/\",[20,[\"model\",\"article\",\"image\"]]]]],[9,\"class\",\"desktop-hide\"],[9,\"alt\",\"\"],[7],[8],[0,\"\\n\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\"],[8],[0,\"\\n\\t\\t\"],[6,\"div\"],[9,\"class\",\"article-heading\"],[7],[6,\"h1\"],[9,\"class\",\"article-title\"],[7],[1,[20,[\"model\",\"article\",\"title\"]],false],[0,\" Gallery\"],[8],[8],[0,\"\\n\\t\\t\"],[6,\"div\"],[9,\"class\",\"article-body\"],[7],[0,\"\\n\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"article-meta\"],[7],[0,\"\\n\\t\\t\\t\\t\"],[6,\"span\"],[9,\"class\",\"article-icon\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\"],[6,\"svg\"],[9,\"viewBox\",\"0 0 11.05 16.8\"],[7],[6,\"polyline\"],[9,\"points\",\"8.6,15.5 1.2,8.2 8.6,1.2\"],[7],[8],[8],[0,\"\\n\\t\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\\t\"],[4,\"link-to\",[\"article\",[19,0,[\"model\",\"article\",\"id\"]]],null,{\"statements\":[[0,\" Back to the Challenge \"]],\"parameters\":[]},null],[0,\"\\n\\t\\t\\t\"],[8],[0,\"\\n\\n\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"article-wrap\"],[7],[0,\"\\n\\n\"],[4,\"if\",[[25,\"eq\",[[19,0,[\"model\",\"article\",\"submissionType\"]],\"Photo\"],null]],null,{\"statements\":[[4,\"if\",[[25,\"eq\",[[19,0,[\"model\",\"gallery\",\"length\"]],0],null]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"be-the-first\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"text\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\"],[6,\"p\"],[7],[0,\"Be the first to submit to\"],[8],[0,\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\"],[6,\"h4\"],[9,\"class\",\"title\"],[7],[1,[20,[\"model\",\"article\",\"title\"]],false],[0,\" gallery\"],[8],[0,\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\"],[6,\"button\"],[9,\"id\",\"button-show-upload\"],[9,\"type\",\"button\"],[9,\"class\",\"button button-blue\"],[3,\"action\",[[19,0,[]],\"showGallerySubmission\"]],[7],[0,\"Create Your Submission\"],[8],[0,\"\\n\\t\\t\\t\\t\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\\t\\t\\t\\t\"],[1,[25,\"gallery-submission\",null,[[\"model\"],[[19,0,[\"model\"]]]]],false],[0,\"\\n\\t\\t\\t\\t\\t\\t\"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[4,\"gallery-submission\",null,[[\"model\"],[[19,0,[\"model\"]]]],{\"statements\":[[0,\"\\t\\t\\t\\t\\t\\t\\t\"],[6,\"button\"],[9,\"id\",\"button-show-upload\"],[9,\"type\",\"button\"],[9,\"class\",\"button button-blue\"],[3,\"action\",[[19,0,[]],\"showGallerySubmission\"]],[7],[0,\"Create Your Submission\"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]}],[0,\"\\t\\t\\t\\t\\t\\n\"],[4,\"isotope-grid\",null,null,{\"statements\":[[4,\"each\",[[19,0,[\"model\",\"gallery\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\\t\\t\"],[1,[25,\"gallery-post\",null,[[\"gallery\",\"model\",\"session\",\"data-submission-id\"],[[19,3,[]],[19,0,[\"model\"]],[19,0,[\"session\"]],[19,3,[\"id\"]]]]],false],[0,\"\\n\"]],\"parameters\":[3,4]},null]],\"parameters\":[]},null],[0,\"\\t\\t\\t\\t\\t\\n\"]],\"parameters\":[]},null],[0,\"\\n\\t\\t\\t\"],[8],[2,\" article-wrap \"],[0,\"\\n\\n\"],[4,\"each\",[[19,0,[\"model\",\"pagination\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\"],[6,\"ul\"],[9,\"class\",\"pagination\"],[7],[0,\"\\n\"],[4,\"if\",[[25,\"gt\",[[19,1,[\"page\"]],1],null]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\\t\"],[6,\"button\"],[3,\"action\",[[19,0,[]],\"prevPage\"]],[7],[0,\"Prev\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[25,\"lt\",[[19,1,[\"page\"]],[19,1,[\"total_pages\"]]],null]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\\t\"],[6,\"button\"],[3,\"action\",[[19,0,[]],\"nextPage\"]],[7],[0,\"Next\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\t\\t\\t\\t\"],[8],[0,\"\\n\"]],\"parameters\":[1,2]},null],[0,\"\\n\\t\\t\"],[8],[0,\"\\n\\t\"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/gallery.hbs" } });
});
define("frontend/templates/head", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "6Xzro6fA", "block": "{\"symbols\":[],\"statements\":[[6,\"meta\"],[9,\"property\",\"og:site_name\"],[9,\"content\",\"8th Mind\"],[7],[8],[0,\"\\n\"],[6,\"meta\"],[9,\"property\",\"og:type\"],[9,\"content\",\"website\"],[7],[8],[0,\"\\n\"],[6,\"meta\"],[9,\"property\",\"og:title\"],[10,\"content\",[20,[\"model\",\"title\"]],null],[7],[8],[0,\"\\n\"],[6,\"meta\"],[9,\"property\",\"og:url\"],[10,\"content\",[20,[\"model\",\"url\"]],null],[7],[8],[0,\"\\n\"],[6,\"meta\"],[9,\"property\",\"og:image\"],[10,\"content\",[20,[\"model\",\"image\"]],null],[7],[8],[0,\"\\n\"],[6,\"meta\"],[9,\"property\",\"og:description\"],[10,\"content\",[20,[\"model\",\"description\"]],null],[7],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/head.hbs" } });
});
define("frontend/templates/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "696FVx7S", "block": "{\"symbols\":[\"article\",\"index\",\"article\",\"index\",\"article\",\"index\",\"article\",\"index\"],\"statements\":[[0,\"\\n\"],[6,\"section\"],[9,\"id\",\"page-index\"],[7],[0,\"\\n\\t\"],[6,\"div\"],[9,\"class\",\"post-row\"],[7],[0,\"\\n\"],[4,\"each\",[[19,0,[\"model\"]]],null,{\"statements\":[[4,\"if\",[[25,\"eq\",[[19,8,[]],0],null]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\"],[1,[25,\"article-post\",null,[[\"article\",\"class\"],[[19,7,[]],\"post-hero\"]]],false],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[25,\"eq\",[[19,8,[]],1],null]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\"],[1,[25,\"article-post\",null,[[\"article\",\"class\"],[[19,7,[]],\"post-small\"]]],false],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[7,8]},null],[0,\"\\t\"],[8],[0,\"\\n\\n\\t\"],[6,\"div\"],[9,\"class\",\"post-row\"],[7],[0,\"\\n\"],[4,\"each\",[[19,0,[\"model\"]]],null,{\"statements\":[[4,\"if\",[[25,\"eq\",[[19,6,[]],2],null]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\"],[1,[25,\"article-post\",null,[[\"article\",\"class\"],[[19,5,[]],\"post-small\"]]],false],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[25,\"eq\",[[19,6,[]],3],null]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\"],[1,[25,\"article-post\",null,[[\"article\",\"class\"],[[19,5,[]],\"post-large\"]]],false],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[25,\"eq\",[[19,6,[]],4],null]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\"],[1,[25,\"article-post\",null,[[\"article\",\"class\"],[[19,5,[]],\"post-small\"]]],false],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[5,6]},null],[0,\"\\t\"],[8],[0,\"\\n\\n\\t\"],[6,\"div\"],[9,\"class\",\"post-row single-column\"],[7],[0,\"\\n\\t\\t\"],[6,\"div\"],[9,\"class\",\"post-three-row\"],[7],[0,\"\\n\"],[4,\"each\",[[19,0,[\"model\"]]],null,{\"statements\":[[4,\"if\",[[25,\"eq\",[[19,4,[]],5],null]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\"],[1,[25,\"article-post\",null,[[\"article\"],[[19,3,[]]]]],false],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[25,\"eq\",[[19,4,[]],6],null]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\"],[1,[25,\"article-post\",null,[[\"article\"],[[19,3,[]]]]],false],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[25,\"eq\",[[19,4,[]],7],null]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\"],[1,[25,\"article-post\",null,[[\"article\"],[[19,3,[]]]]],false],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[3,4]},null],[0,\"\\t\\t\\t\"],[6,\"hr\"],[9,\"class\",\"yellow\"],[7],[8],[0,\"\\n\\t\\t\"],[8],[0,\"\\n\\n\\t\\t\"],[6,\"div\"],[9,\"class\",\"page-articles-container\"],[7],[0,\"\\n\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"page-articles-wrap\"],[7],[0,\"\\n\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"post-one-row\"],[7],[0,\"\\n\"],[4,\"each\",[[19,0,[\"model\"]]],null,{\"statements\":[[4,\"if\",[[25,\"eq\",[[19,2,[]],8],null]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"page-articles-row\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\"],[1,[25,\"article-post\",null,[[\"article\"],[[19,1,[]]]]],false],[0,\"\\n\\t\\t\\t\\t\\t\\t\\t\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[25,\"eq\",[[19,2,[]],9],null]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"page-articles-row\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\"],[1,[25,\"article-post\",null,[[\"article\"],[[19,1,[]]]]],false],[0,\"\\n\\t\\t\\t\\t\\t\\t\\t\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[25,\"eq\",[[19,2,[]],10],null]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"page-articles-row\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\"],[1,[25,\"article-post\",null,[[\"article\"],[[19,1,[]]]]],false],[0,\"\\n\\t\\t\\t\\t\\t\\t\\t\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[25,\"eq\",[[19,2,[]],11],null]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"page-articles-row\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\\t\\t\\t\"],[1,[25,\"article-post\",null,[[\"article\"],[[19,1,[]]]]],false],[0,\"\\n\\t\\t\\t\\t\\t\\t\\t\"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[1,2]},null],[0,\"\\t\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\"],[8],[0,\"\\n\\t\"],[8],[0,\"\\n\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/index.hbs" } });
});
define("frontend/templates/login", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "DpjfSvRy", "block": "{\"symbols\":[],\"statements\":[[6,\"section\"],[9,\"id\",\"page-register-login\"],[7],[0,\"\\n\\t\"],[6,\"div\"],[9,\"class\",\"form\"],[7],[0,\"\\n\\t\\t\"],[6,\"h2\"],[7],[0,\"Login to your account\"],[8],[0,\"\\n\\t\\t\"],[6,\"form\"],[7],[0,\"\\n\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"form-input\"],[7],[0,\"\\n\\t\\t\\t\\t\"],[1,[25,\"input\",null,[[\"value\",\"type\",\"placeholder\"],[[19,0,[\"email\"]],\"email\",\"Email\"]]],false],[0,\"\\n\\t\\t\\t\\t\"],[1,[25,\"display-errors\",null,[[\"errors\",\"showErrors\",\"class\"],[[19,0,[\"errors\",\"email\"]],[19,0,[\"showErrors\"]],\"form-error\"]]],false],[0,\"\\n\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"form-input\"],[7],[0,\"\\n\\t\\t\\t\\t\"],[1,[25,\"input\",null,[[\"value\",\"type\",\"placeholder\"],[[19,0,[\"password\"]],\"password\",\"Password\"]]],false],[0,\"\\n\\t\\t\\t\\t\"],[1,[25,\"display-errors\",null,[[\"errors\",\"showErrors\",\"class\"],[[19,0,[\"errors\",\"password\"]],[19,0,[\"showErrors\"]],\"form-error\"]]],false],[0,\"\\n\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"button\"],[3,\"action\",[[19,0,[]],\"login\"]],[7],[6,\"span\"],[9,\"class\",\"button button-teal\"],[7],[0,\"Login\"],[8],[8],[0,\"\\n\\t\\t\"],[8],[0,\"\\n\\t\\t\"],[6,\"p\"],[7],[4,\"link-to\",[\"forget-password\"],[[\"class\"],[\"login\"]],{\"statements\":[[6,\"span\"],[7],[0,\"Forgot your password?\"],[8]],\"parameters\":[]},null],[8],[0,\"\\n\\t\"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/login.hbs" } });
});
define("frontend/templates/privacy", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "ZYeaGiWA", "block": "{\"symbols\":[],\"statements\":[[6,\"section\"],[9,\"class\",\"page-generic\"],[7],[0,\"\\n\\t\"],[6,\"div\"],[9,\"class\",\"single-col\"],[7],[0,\"\\n\\t\\t\"],[6,\"div\"],[9,\"class\",\"col\"],[7],[0,\"\\n\\t\\t\\t\"],[6,\"h1\"],[7],[0,\" Terms of Use & Privacy Policy\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"Eighth Mind, Inc. (“Company” or “we” or “us” or “our”) respects the privacy of its users (“user” or “you”) that use our website located at 8thmind.com, including other media forms, media channels, mobile website or mobile application related or connected thereto (collectively, the “Website”). The following Company Privacy & Site Terms (“Privacy & Site Terms”) is designed to inform you, as a user of the Website, about the types of information that Company may gather about or collect from you in connection with your use of the Website. It also is intended to explain the conditions under which Company uses and discloses that information, and your rights in relation to that information. Changes to this Privacy & Site Terms are discussed at the end of this document. Each time you use the Website, however, the current version of this Privacy & Site Terms will apply. Accordingly, each time you use the Website you should check the date of this Privacy & Site Terms (which appears at the beginning of this document) and review any changes since the last time you used the Website.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"The Website is hosted in the United States of America and is subject to U.S. state and federal law. If you are accessing our Website from other jurisdictions, please be advised that you are transferring your personal information to us in the United States, and by using our Website, you consent to that transfer and use of your personal information in accordance with this Privacy & Site Terms. You also agree to abide by the applicable laws of applicable states and U.S. federal law concerning your use of the Website and your agreements with us. Any persons accessing our Website from any jurisdiction with laws or regulations governing the use of the Internet, including personal data collection, use and disclosure, different from those of the jurisdictions mentioned above may only use the Website in a manner lawful in their jurisdiction. If your use of the Website would be unlawful in your jurisdiction, please do not use the Website.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"BY USING OR ACCESSING THE WEBSITE, YOU ARE ACCEPTING THE PRACTICES DESCRIBED IN THIS PRIVACY & SITE TERMS.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[6,\"strong\"],[7],[0,\"GATHERING, USE AND DISCLOSURE OF NON-PERSONALLY-IDENTIFYING INFORMATION\"],[8],[8],[0,\"\\n\\t\\t\\t\"],[6,\"h3\"],[7],[0,\"Users of the Website Generally\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"“Non-Personally-Identifying Information” is information that, without the aid of additional information, cannot be directly associated with a specific person. “Personally-Identifying Information,” by contrast, is information such as a name or email address that, without more, can be directly associated with a specific person. Like most website operators, Company gathers from users of the Website Non-Personally-Identifying Information of the sort that Web browsers, depending on their settings, may make available. That information includes the user’s Internet Protocol (IP) address, operating system, browser type and the locations of the websites the user views right before arriving at, while navigating and immediately after leaving the Website. Although such information is not Personally-Identifying Information, it may be possible for Company to determine from an IP address a user’s Internet service provider and the geographic location of the visitor’s point of connectivity as well as other statistical usage data. Company analyzes Non-Personally-Identifying Information gathered from users of the Website to help Company better understand how the Website is being used. By identifying patterns and trends in usage, Company is able to better design the Website to improve users’ experiences, both in terms of content and ease of use. From time to time, Company may also release the Non-Personally-Identifying Information gathered from Website users in the aggregate, such as by publishing a report on trends in the usage of the Website.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"h3\"],[7],[0,\"Web Cookies\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"A “Web Cookie” is a string of information which assigns you a unique identification that a website stores on a user’s computer, and that the user’s browser provides to the website each time the user submits a query to the website. We use cookies on the Website to keep track of services you have used, to record registration information regarding your login name and password, to record your user preferences, to keep you logged into the Website and to facilitate purchase procedures. Company also uses Web Cookies to track the pages that users visit during each Website session, both to help Company improve users’ experiences and to help Company understand how the Website is being used. As with other Non-Personally-Identifying Information gathered from users of the Website, Company analyzes and discloses in aggregated form information gathered using Web Cookies, so as to help Company, its partners and others better understand how the Website is being used. COMPANY USERS WHO DO NOT WISH TO HAVE WEB COOKIES PLACED ON THEIR COMPUTERS SHOULD SET THEIR BROWSERS TO REFUSE WEB COOKIES BEFORE ACCESSING THE WEBSITE, WITH THE UNDERSTANDING THAT CERTAIN FEATURES OF THE WEBSITE MAY NOT FUNCTION PROPERLY WITHOUT THE AID OF WEB COOKIES. WEBSITE USERS WHO REFUSE WEB COOKIES ASSUME ALL RESPONSIBILITY FOR ANY RESULTING LOSS OF FUNCTIONALITY.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"h3\"],[7],[0,\"Web Beacons\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"A “Web Beacon” is an object that is embedded in a web page or email that is usually invisible to the user and allows website operators to check whether a user has viewed a particular web page or an email. Company may use Web Beacons on the Website and in emails to count users who have visited particular pages, viewed emails and to deliver co-branded services. Web Beacons are not used to access users’ Personally-Identifying Information. They are a technique Company may use to compile aggregated statistics about Website usage. Web Beacons collect only a limited set of information, including a Web Cookie number, time and date of a page or email view and a description of the page or email on which the Web Beacon resides. You may not decline Web Beacons. However, they can be rendered ineffective by declining all Web Cookies or modifying your browser setting to notify you each time a Web Cookie is tendered, permitting you to accept or decline Web Cookies on an individual basis.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"h3\"],[7],[0,\"Analytics\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"We may partner with selected third parties to allow tracking technology on the Website, which will enable them to collect data about how you interact with the Website and our services over time. This information may be used to, among other things, analyze and track data, determine the popularity of certain content and better understand online activity.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"h3\"],[7],[0,\"Aggregated and Non-Personally-Identifying Information\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"We may share aggregated and Non-Personally Identifying Information we collect under any of the above circumstances. We may also share it with third parties and our affiliate companies to develop and deliver targeted advertising on the Website and on websites of third parties. We may combine Non-Personally Identifying Information we collect with additional Non-Personally Identifying Information collected from other sources. We also may share aggregated information with third parties, including advisors, advertisers and investors, for the purpose of conducting general business analysis. For example, we may tell our advertisers the number of visitors to the Website and the most popular features or services accessed. This information does not contain any Personally-Identifying Information and may be used to develop website content and services that we hope you and other users will find of interest and to target content and advertising. \"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"h3\"],[7],[0,\"Mobile Device Additional Terms\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"ul\"],[7],[0,\"\\n\\t\\t\\t\"],[6,\"li\"],[7],[6,\"strong\"],[7],[0,\"Mobile Device\"],[8],[0,\". If you use a mobile device to access the Website or download any of our applications, we may collect device information (such as your mobile device ID, model and manufacturer), operating system, version information and IP address.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"li\"],[7],[6,\"strong\"],[7],[0,\"Geo-Location Information\"],[8],[0,\". Unless we have received your prior consent, we do not access or track any location-based information from your mobile device at any time while downloading or using our mobile application or our services, except that it may be possible for Company to determine from an IP address the geographic location of your point of connectivity, in which case we may gather and use such general location data.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"li\"],[7],[6,\"strong\"],[7],[0,\"Push Notifications\"],[8],[0,\". We send you push notifications if you choose to receive them, letting you know when someone has sent you a message or for other service-related matters. If you wish to opt-out from receiving these types of communications, you may turn them off in your device’s settings.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"li\"],[7],[6,\"strong\"],[7],[0,\"Mobile Analytics\"],[8],[0,\". We use mobile analytics software to allow us to better understand the functionality of our mobile software on your phone. This software may record information, such as how often you use the application, the events that occur within the application, aggregated usage, performance data and where the application was downloaded from. We do not link the information we store within the analytics software to any Personally-Identifying Information you submit within the mobile application.\"],[8],[0,\"\\n\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"h3\"],[7],[0,\"Copyright on Submissions\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"Eighth Mind, Inc. does not claim ownership rights in your content and/or submissions. By submitting content to the Eighth Mind, Inc. digital experiences you allow Eighth Mind, Inc. on a non-exclusive and royalty-free basis to store, share, publish, format, and publicly display your content.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"We respect the rights of all persons throughout the world and expect our members to assist us in fostering positivity, fairness, and respect for all members, visitors, and other persons that engage in the Eighth Mind, Inc. environment.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"This document is not a legal guide or professional advice and does not replace the importance of seeking an attorney if you would like to better understand your rights as relates to your copyright. In the following paragraphs we will try to clarify the Eighth Mind, Inc. policies relating to copyright.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"Under most national and international laws a copyright is automatically valid on any original work once you make it. Exercising those rights may require registering the copyright using the tools at your disposal.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"h3\"],[7],[0,\"Infringement\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"Examples of copyright infringement may include:\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"ul\"],[7],[0,\"\\n\\t\\t\\t\"],[6,\"li\"],[7],[0,\"Using .0001-100% of someone else’s work without permission.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"li\"],[7],[0,\"Using someone else’s work in a commercial capacity without permission, including but not limited to leveraging the work to advertise or to generate revenue.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"li\"],[7],[0,\"Placing or publishing someone else’s work in an environment or physical asset without permission.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"li\"],[7],[0,\"Modifying someone else’s work or converting it to another medium without permission.\"],[8],[0,\"\\n\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"h3\"],[7],[0,\"Guidance\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"Everything you create should be original. If you use materials owned or copyrighted by others, be sure to have secured proper permissions or licenses.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"Any copyright owner can require Eighth Mind, Inc. to remove his or her copyrighted content from Eighth Mind, Inc. Persons flagging copyright infringement should submit a request to the Eighth Mind, Inc. team to inform us that a member submission on Eighth Mind, Inc. is infringing upon the copyrights of another and we will immediately delete it. The member will not be given an opportunity to alter the work, nor will they be warned of the removal.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"Report submissions that you believe are infringing on your copyright via email or the help desk. Our internal team will review your request and act accordingly.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"If you believe that one of your submissions was removed in error you may contact our help desk or otherwise file a counter notice.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"Members that repeatedly are reported for copyright infringement may be banned from Eighth Mind, Inc. A copyright owner may or may not decide to directly for infringing upon their copyright in posting to Eighth Mind, Inc.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"h3\"],[7],[0,\"Mature Submissions on Comments\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"When we discuss mature content we are specifically referring to images, subjects, and themes which other viewers may find offensive, including but not limited to nudity, or violence. Materials classified as pornographic or obscene are prohibited. Content that depicts minors (real or fictional) in an exposed or sexual manner will be removed and deleted immediately. The Eighth Mind, Inc. staff further reserves the right to remove any piece of content at its sole discretion.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"h3\"],[7],[0,\"Community Etiquette\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"Eighth Mind, Inc. is a global community. \"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"Members may express themselves within reason while respecting and nurturing fellow members of the community. Discrimination, harassment, bullying, prejudice, and similar aggressive behavior will not be tolerated. This is a safe space for persons of all ages and skill levels. \"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"We accept contributions on the Eighth Mind, Inc. digital experience that range from every background, experience, and skill level. We expect the community to support and foster positivity, constructive feedback, and moderated feedback. \"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"We will not accept any behavior that can be considered aggressive or otherwise disrespectful. We absolutely will not allow participation from members who intentionally engage in activities that are inherently offensive, racist, bigoted, or otherwise inappropriate. We ask that you focus your activities on productive conversation and steer clear of remarks that could be offensive to persons including those based on nationality, race, gender, religion, or sexual orientation. \"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"If you feel that you have been the target of harassment please contact the Eighth Mind, Inc. help desk. Staff will evaluate and intervene if they determine an extreme and directly intentional aggressive or inappropriate behavior is creating problems.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"h3\"],[7],[0,\"Social Media\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"We may provide you the option to connect your account on the Website to your account on some social networking sites for the purpose of logging in, uploading information or enabling certain features on the Website. When logging in using your social network credentials, we may collect the Personally-Identifying Information you have made publicly available on the social networking site, such as your name, profile picture, cover photo, username, gender, friends network, age range, locale, friend list and any other information you have made public. Once connected, other users may also be able to see information about your social network, such as the size of your network and your friends, including common friends. By connecting your account on the Website to your account on any social networking site, you hereby consent to the continuous release of information about you to us. We will not send any of your account information to the connected social networking site without first disclosing that to you. Each social network may further allow you to set privacy controls around your information on their system, and our collection of information will always follow such controls and permissions. This feature is subject to continuous change and improvement by us and each social networking site involved, and therefore the available features and shared information are subject to change without notice to you.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"We may use hyperlinks on the Website which will redirect you to a social network if you click on the respective link. However, when you click on a social plug-in, such as Facebook’s “Like” button, Twitter’s “tweet” button or the Google+, that particular social network’s plugin will be activated and your browser will directly connect to that provider’s servers. If you do not use these buttons, none of your data will be sent to the respective social network’s plugin provider. So for example, when you click on the Facebook’s “Like” button on the Website, Facebook will receive your IP address, the browser version and screen resolution, and the operating system of the device you have used to access the Website. Settings regarding privacy protection can be found on the websites of these social networks and are not within our control.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[6,\"strong\"],[7],[0,\"COLLECTION, USE AND DISCLOSURE OF PERSONALLY-IDENTIFYING INFORMATION\"],[8],[8],[0,\"\\n\\t\\t\\t\"],[6,\"h3\"],[7],[0,\"Website Registration\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"As defined above, Personally-Identifying Information is information that can be directly associated with a specific person. Company may collect a range of Personally-Identifying Information from and about Website users. Much of the Personally-Identifying Information collected by Company about users is information provided by users themselves when (1) registering for our service, (2) logging in with social network credentials, (3) participating in polls, contests, surveys or other features of our service, or responding to offers or advertisements, (4) communicating with us, (5) creating a public profile or (6) signing up to receive newsletters. That information may include each user’s name, address, email address and telephone number, and, if you transact business with us, financial information such as your payment method (valid credit card number, type, expiration date or other financial information). We also may request information about your interests and activities, your gender, age, date of birth, username, hometown and other demographic or relevant information as determined by Company from time to time. Users of the Website are under no obligation to provide Company with Personally-Identifying Information of any kind, with the caveat that a user’s refusal to do so may prevent the user from using certain Website features.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"BY REGISTERING WITH OR USING THE WEBSITE, YOU CONSENT TO THE USE AND DISCLOSURE OF YOUR PERSONALLY-IDENTIFYING INFORMATION AS DESCRIBED IN THIS “COLLECTION, USE AND DISCLOSURE OF PERSONALLY-IDENTIFYING INFORMATION” SECTION.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"h3\"],[7],[0,\"Online Postings\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"Certain Personally-Identifying Information collected from users may be disclosed as a matter of course as a result of your use of the Website. We may provide areas on the Website where you can post comments, images, video links, editorial content, reviews, and other information relating to your activities on the Website. Such postings are governed by our Terms of Use. In addition, such postings may appear on other websites or when searches are executed on the subject of your posting. Also, whenever you voluntarily disclose personal information on publicly-viewable web pages, that information will be publicly available and can be collected and used by others. For example, if you post your email address, you may receive unsolicited messages. We cannot control who reads your posting or what other users may do with the information you voluntarily post, so we encourage you to exercise discretion and caution with respect to your personal information. USERS ASSUME ALL RESPONSIBILITY FOR ANY LOSS OF PRIVACY OR OTHER HARM RESULTING FROM THEIR VOLUNTARY DISCLOSURE OF PERSONALLY IDENTIFYING INFORMATION.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"h3\"],[7],[0,\"Company Communications\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"We may occasionally use your name and email address to send you notifications regarding new services offered by the Website that we think you may find valuable. We may also send you service-related announcements from time to time through the general operation of the service. Generally, you may opt out of such emails at the time of registration or through your account settings, though we reserve the right to send you notices about your account, such as service announcements and administrative messages, even if you opt out of all voluntary email notifications.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"h3\"],[7],[0,\"Company Disclosures\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"Company will disclose Personally-Identifying Information under the following circumstances:\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"ul\"],[7],[0,\"\\n\\t\\t\\t\"],[6,\"li\"],[7],[6,\"strong\"],[7],[0,\"By Law or to Protect Rights\"],[8],[0,\". When we believe disclosure is appropriate, we may disclose Personally-Identifying Information in connection with efforts to investigate, prevent or take other action regarding illegal activity, suspected fraud or other wrongdoing; to protect and defend the rights, property or safety of Company, our users, our employees or others; to comply with applicable law or cooperate with law enforcement; to enforce our Terms of Use or other agreements or policies, in response to a subpoena or similar investigative demand, a court order or a request for cooperation from a law enforcement or other government agency; to establish or exercise our legal rights; to defend against legal claims; or as otherwise required by law. In such cases, we may raise or waive any legal objection or right available to us.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"li\"],[7],[6,\"strong\"],[7],[0,\"Marketing Communications\"],[8],[0,\". Unless users opt-out from receiving Company marketing materials upon registration, Company may email users about products and services that Company believes may be of interest to them. If you wish to opt-out of receiving marketing materials from Company, you may do so by following the unsubscribe link in the email communications, by going to your account settings (if applicable) or contacting us using the contact information below.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"li\"],[7],[6,\"strong\"],[7],[0,\"Third-Party Service Providers\"],[8],[0,\". We may share your Personally-Identifying Information, which may include your name and contact information (including email address) with our authorized service providers that perform certain services on our behalf. These services may include fulfilling orders, providing customer service and marketing assistance, performing business and sales analysis, supporting the Website’s functionality and supporting contests, sweepstakes, surveys and other features offered through the Website. We may also share your name, contact information and credit card information with our authorized service providers who process credit card payments. These service providers may have access to personal information needed to perform their functions but are not permitted to share or use such information for any other purpose.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"li\"],[7],[6,\"strong\"],[7],[0,\"Business Transfers; Bankruptcy\"],[8],[0,\". Company reserves the right to transfer all Personally-Identifying Information in its possession to a successor organization in the event of a merger, acquisition, bankruptcy or other sale of all or a portion of Company’s assets. Other than to the extent ordered by a bankruptcy or other court, the use and disclosure of all transferred Personally-Identifying Information will be subject to this Privacy & Site Terms, or to a new Privacy & Site Terms if you are given notice of that new Privacy & Site Terms and are given an opportunity to affirmatively opt-out of it. Personally-Identifying Information submitted or collected after a transfer, however, may be subject to a new Privacy & Site Terms adopted by the successor organization.\"],[8],[0,\"\\n\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"h3\"],[7],[0,\"Changing Personally-Identifying Information; Account Termination\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"You may at any time review or change your Personally-Identifying Information by going to your account settings (if applicable) or contacting us using the contact information below.  Upon your request, we will deactivate or delete your account and contact information from our active databases. Such information will be deactivated or deleted as soon as practicable based on your account activity and accordance with our deactivation policy and applicable law. To make this request, either go to your account settings (if applicable) or contact us as provided below. We will retain in our files some Personally-Identifying Information to prevent fraud, to troubleshoot problems, to assist with any investigations, to enforce our Terms of Use and to comply with legal requirements as is permitted by law. Therefore, you should not expect that all your Personally-Identifying Information will be completely removed from our databases in response to your requests. Additionally, we keep a history of changed information to investigate suspected fraud with your account.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"h3\"],[7],[0,\"General Use\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"Company uses the Personally-Identifying Information in the file we maintain about you, and other information we obtain from your current and past activities on the Website (1) to deliver the products and services that you have requested; (2) to manage your account and provide you with customer support; (3) to communicate with you by email, postal mail, telephone and/or mobile devices about products or services that may be of interest to you either from us, our affiliate companies or other third parties; (4) to develop and display content and advertising tailored to your interests on the Website and other sites; (5) to resolve disputes and troubleshoot problems; (6) to measure consumer interest in our services; (7) to inform you of updates; (8) to customize your experience; (9) to detect and protect us against error, fraud and other criminal activity; (10) to enforce our Terms of Use; and (11) to do as otherwise described to you at the time of collection. At times, we may look across multiple users to identify problems. In particular, we may examine your Personally-Identifying Information to identify users using multiple user IDs or aliases. We may compare and review your Personally-Identifying Information for accuracy and to detect errors and omissions. We may use financial information or payment method to process payment for any purchases made on the Website, enroll you in the discount, rebate, and other programs in which you elect to participate, to protect against or identify possible fraudulent transactions and otherwise as needed to manage our business.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"h3\"],[7],[0,\"Collection and use of Information by Third Parties Generally\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"Company contractually prohibits its contractors, affiliates, vendors and suppliers from disclosing Personally-Identifying Information received from Company, other than in accordance with this Privacy & Site Terms. However, third parties are under no obligation to comply with this Privacy & Site Terms with respect to Personally-Identifying Information that users provide directly to those third parties, or that those third parties collect for themselves. These third parties include advertisers, providers of games, utilities, widgets and a variety of other third-party applications accessible through the Website. Company neither owns nor controls the third-party websites and applications accessible through the Website. Thus, this Privacy & Site Terms does not apply to information provided to or gathered by the third parties that operate them. Before visiting a third party, or using a third-party application, whether by means of a link on the Website, directly through the Website or otherwise, and before providing any Personally-Identifying Information to any such third party, users should inform themselves of the privacy policies and practices (if any) of the third party responsible for that website or application, and should take those steps necessary to, in those users’ discretion, protect their privacy.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"h3\"],[7],[0,\"Site Abuse\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"The Eighth Mind, Inc. staff will not tolerate attempts to exploit or disrupt the operation or security of the Eighth Mind, Inc. digital experiences. Actions to in any way disrupt the Eighth Mind technology will result in an immediate ban of access.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"h3\"],[7],[0,\"Security\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"We take the security of your Personally-Identifying Information seriously and use reasonable electronic, personnel and physical measures to protect it from loss, theft, alteration or misuse.  However, please be advised that even the best security measures cannot fully eliminate all risks. We cannot guarantee that only authorized persons will view your information. We are not responsible for third-party circumvention of any privacy settings or security measures.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"We are dedicated to protect all information on the Website as is necessary. However, you are responsible for maintaining the confidentiality of your Personally-Identifying Information by keeping your password confidential. You should change your password immediately if you believe someone has gained unauthorized access to it or your account. If you lose control of your account, you should notify us immediately.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"h3\"],[7],[0,\"Privacy & Site Terms Changes\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"Company may, in its sole discretion, change this Privacy & Site Terms from time to time. Any and all changes to Company’s Privacy & Site Terms will be reflected on this page and the date new versions are posted will be stated at the top of this Privacy & Site Terms. Unless stated otherwise, our current Privacy & Site Terms applies to all information that we have about you and your account. Users should regularly check this page for any changes to this Privacy & Site Terms. Company will always post new versions of the Privacy & Site Terms on the Website. However, Company may, as determined in its discretion, decide to notify users of changes made to this Privacy & Site Terms via email or otherwise. Accordingly, it is important that users always maintain and update their contact information.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"h3\"],[7],[0,\"Children\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"The Children's Online Privacy Protection Act (\\\"COPPA\\\") protects the online privacy of children under 13 years of age. We do not knowingly collect or maintain Personally-Identifying Information from anyone under the age of 13, unless or except as permitted by law. Any person who provides Personally-Identifying Information through the Website represents to us that he or she is 13 years of age or older. If we learn that Personally-Identifying Information has been collected from a user under 13 years of age on or through the Website, then we will take the appropriate steps to cause this information to be deleted. If you are the parent or legal guardian of a child under 13 who has become a member of the Website or has otherwise transferred Personally-Identifying Information to the Website, please contact Company using our contact information below to have that child's account terminated and information deleted.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"h3\"],[7],[0,\"California Privacy Rights\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"California Civil Code Section 1798.83, also known as the \\\"Shine The Light\\\" law, permits our users who are California residents to request and obtain from us, once a year and free of charge, information about the Personally-Identifying Information (if any) we disclosed to third parties for direct marketing purposes in the preceding calendar year. If applicable, this information would include a list of the categories of the Personally-Identifying Information that was shared and the names and addresses of all third parties with which we shared Personally-Identifying Information in the immediately preceding calendar year. If you are a California resident and would like to make such a request, please submit your request in writing to our privacy officer as listed below.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"h3\"],[7],[0,\"Do-Not-Track Policy\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"Most web browsers and some mobile operating systems include a Do-Not-Track (“DNT”) feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. Because there is not yet a common understanding of how to interpret the DNT signal, the Website currently does not respond to DNT browser signals or mechanisms.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"h3\"],[7],[0,\"Policy Changes\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"These policies may be modified at any time with or without notification and these new polices shall be enforced in full.\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"h3\"],[7],[0,\"Contact\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"p\"],[7],[0,\"If you have any questions regarding our Privacy & Site Terms, please contact our Privacy Officer at: \"],[6,\"a\"],[9,\"href\",\"mailto:info@8thmind.com?subject=8th Mind Privacy Policy\"],[7],[0,\"info@8thmind.com\"],[8],[8],[0,\"\\n\\t\\t\"],[8],[0,\"\\n\\t\"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/privacy.hbs" } });
});
define("frontend/templates/register", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "XPuT8WVk", "block": "{\"symbols\":[],\"statements\":[[6,\"section\"],[9,\"id\",\"page-register-login\"],[7],[0,\"\\n\\t\"],[6,\"div\"],[9,\"class\",\"form\"],[7],[0,\"\\n\\t\\t\"],[6,\"h2\"],[7],[0,\"Register for an account\"],[8],[0,\"\\n\\t\\t\"],[6,\"form\"],[7],[0,\"\\n\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"form-input\"],[7],[0,\"\\n\\t\\t\\t\\t\"],[1,[25,\"input\",null,[[\"value\",\"type\",\"placeholder\"],[[19,0,[\"userFirstName\"]],\"text\",\"First Name\"]]],false],[0,\"\\n\\t\\t\\t\\t\"],[1,[25,\"display-errors\",null,[[\"errors\",\"showErrors\",\"class\"],[[19,0,[\"errors\",\"userFirstName\"]],[19,0,[\"showErrors\"]],\"form-error\"]]],false],[0,\"\\n\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"form-input\"],[7],[0,\"\\n\\t\\t\\t\\t\"],[1,[25,\"input\",null,[[\"value\",\"type\",\"placeholder\"],[[19,0,[\"userLastName\"]],\"text\",\"Last Name\"]]],false],[0,\"\\n\\t\\t\\t\\t\"],[1,[25,\"display-errors\",null,[[\"errors\",\"showErrors\",\"class\"],[[19,0,[\"errors\",\"userLastName\"]],[19,0,[\"showErrors\"]],\"form-error\"]]],false],[0,\"\\n\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"form-input\"],[7],[0,\"\\n\\t\\t\\t\\t\"],[1,[25,\"input\",null,[[\"value\",\"type\",\"placeholder\"],[[19,0,[\"userEmail\"]],\"email\",\"Email\"]]],false],[0,\"\\n\\t\\t\\t\\t\"],[1,[25,\"display-errors\",null,[[\"errors\",\"showErrors\",\"class\"],[[19,0,[\"errors\",\"userEmail\"]],[19,0,[\"showErrors\"]],\"form-error\"]]],false],[0,\"\\n\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"form-input\"],[7],[0,\"\\n\\t\\t\\t\\t\"],[1,[25,\"input\",null,[[\"value\",\"type\",\"placeholder\"],[[19,0,[\"password\"]],\"password\",\"Password\"]]],false],[0,\"\\n\\t\\t\\t\\t\"],[1,[25,\"display-errors\",null,[[\"errors\",\"showErrors\",\"class\"],[[19,0,[\"errors\",\"password\"]],[19,0,[\"showErrors\"]],\"form-error\"]]],false],[0,\"\\n\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"checkbox\"],[7],[0,\"\\n\\t\\t\\t\\t\"],[1,[25,\"input\",null,[[\"type\",\"checked\",\"class\",\"name\",\"checked\"],[\"checkbox\",\"true\",\"checkbox-input\",\"subscribeCheck\",[19,0,[\"subscribeCheck\"]]]]],false],[0,\" Yes, I am interested in receiving emails about creative challenges, articles, and what’s new at 8th Mind.\\n\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\"],[6,\"button\"],[3,\"action\",[[19,0,[]],\"register\"]],[7],[6,\"span\"],[9,\"class\",\"button button-teal\"],[7],[0,\"Register\"],[8],[8],[0,\"\\n\\t\\t\"],[8],[0,\"\\n\\t\\t\"],[6,\"p\"],[7],[0,\"Already a Member? \"],[4,\"link-to\",[\"login\"],[[\"class\"],[\"login\"]],{\"statements\":[[6,\"span\"],[7],[0,\"Login\"],[8]],\"parameters\":[]},null],[8],[0,\"\\n\\t\"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/register.hbs" } });
});
define("frontend/templates/reset-password-process", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "f6AtzWfR", "block": "{\"symbols\":[],\"statements\":[[0,\" \"],[6,\"section\"],[9,\"id\",\"blog\"],[9,\"class\",\"login\"],[7],[0,\"\\n\\t\\t\"],[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"col-md-6 col-md-offset-3\"],[7],[0,\"\\n\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"module form-module\"],[7],[0,\"\\n\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"toggle\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\"],[6,\"i\"],[9,\"class\",\"fa fa-lock\"],[7],[8],[0,\"\\n\\t\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\\t\"],[6,\"div\"],[9,\"class\",\"form\"],[7],[0,\"\\n\\t\\t\\t\\t\\t\"],[6,\"h2\"],[7],[0,\"Reset your password\"],[8],[0,\"\\n\\t\\t\\t\\t\\t\"],[6,\"form\"],[7],[0,\"\\t\\t\\t\\t\\t\\t\\n                        \\n                        \"],[1,[25,\"input\",null,[[\"value\",\"type\",\"placeholder\"],[[19,0,[\"newPassword\"]],\"password\",\"New Password\"]]],false],[0,\"\\n\\t\\t\\t\\t    \\t\"],[1,[25,\"display-errors\",null,[[\"errors\",\"showErrors\"],[[19,0,[\"errors\",\"newPassword\"]],[19,0,[\"showErrors\"]]]]],false],[0,\" \\n                        \\n                        \"],[1,[25,\"input\",null,[[\"value\",\"type\",\"placeholder\"],[[19,0,[\"newPasswordConfirmation\"]],\"password\",\"Retype New Password\"]]],false],[0,\"\\n\\t\\t\\t\\t    \\t\"],[1,[25,\"display-errors\",null,[[\"errors\",\"showErrors\"],[[19,0,[\"errors\",\"newPasswordConfirmation\"]],[19,0,[\"showErrors\"]]]]],false],[0,\" \\n                        \"],[1,[25,\"input\",null,[[\"value\",\"type\"],[[19,0,[\"token\"]],\"hidden\"]]],false],[0,\"\\n\\t\\t\\t\\t\\t  \\n\\t\\t\\t\\t\\t\\t\"],[6,\"button\"],[3,\"action\",[[19,0,[]],\"change\"]],[7],[0,\"Reset Password\"],[8],[0,\"\\n\\t\\t\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\\t\"],[8],[0,\"\\n\\t\\t\"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "frontend/templates/reset-password-process.hbs" } });
});


define('frontend/config/environment', ['ember'], function(Ember) {
  var prefix = 'frontend';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

if (!runningTests) {
  require("frontend/app")["default"].create({"name":"frontend","version":"0.0.0+a09889ec"});
}
//# sourceMappingURL=frontend.map
