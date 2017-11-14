let mocha = require('mocha');
let chai = require('chai');
let expect = chai.expect;
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('Security Routes', function() {
  it('should allow login to return a token');
  it('should allow registering a new user without a token');
  it('should allow subscribing for emails without being logged in');
});

describe('User Routes', function() {
  it('should require email to be verified by a user prior to logging in');
  it('should walk the user through forgotten password');
  it('should be able to return the details about a user');
});
