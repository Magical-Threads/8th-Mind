/* eslint-env node */
'use strict';

var express_domain = 'api.8thmind.com';
var defaultMetaTags = require('ember-sharable');

module.exports = function(environment) {

	let ENV = {
		modulePrefix: 'frontend',
		serverPath: 'http://' + express_domain + '/',
		environment,
		rootURL: '/',
		locationType: 'auto',
		EmberENV: {
			FEATURES: {
				// Here you can enable experimental features on an ember canary build
				// e.g. 'with-controller': true
			},
			EXTEND_PROTOTYPES: {
				// Prevent Ember Data from overriding Date.parse.
				Date: false
			}
		},
		APP: {
			// Here you can pass flags/options to your application instance
			// when it is created
		},
		sharable: {
			defaults: {
				title: '8th Mind',
				url: 'www.8thmind.com',
				description: '8th Mind is a global community where everyone is welcome. Visitors can discover new stories and share the worlds they have created. Members can work together on artistic challenges and find support from the greatest storytellers alive.',
				image: 'http://api.8thmind.com/storage/articles/3fcac3728791c53bdee5888efee8e93e.jpg',

			}
		},
		contentSecurityPolicy: {
			'default-src': "'none'",
			'font-src': "'self'",
			'img-src': "'self'",
			'media-src': "'self'",
			'style-src': "'self' 'unsafe-inline'",
			'script-src': "'self' 'unsafe-eval' http://"+express_domain,
			'connect-src': "'self' ws://"+express_domain
		},
		lightbox: {
			lightboxOptions: {
				alwaysShowNavOnTouchDevices: 	false,
				albumLabel:						"Image %1 of %2",
				disableScrolling:				false,
				fadeDuration:					500,
				fitImagesInViewport:			true,
				maxWidth:						1000,
				maxHeight:						1000,
				positionFromTop:				50,
				resizeDuration:					700,
				showImageNumberLabel:			true
			}
		}

	};

	if (environment === 'development') {
		// ENV.APP.LOG_RESOLVER = true;
		// ENV.APP.LOG_ACTIVE_GENERATION = true;
		// ENV.APP.LOG_TRANSITIONS = true;
		// ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
		// ENV.APP.LOG_VIEW_LOOKUPS = true;
		ENV.serverPath = "http://localhost:3000/"
	}

	if (environment === 'test') {
		// Testem prefers this...
		ENV.locationType = 'none';

		// keep test console output quieter
		ENV.APP.LOG_ACTIVE_GENERATION = false;
		ENV.APP.LOG_VIEW_LOOKUPS = false;

		ENV.APP.rootElement = '#ember-testing';
		ENV.serverPath = "http://localhost:3000/"
	}

	if (environment === 'production') {

	}

	return ENV;
};
