let mocha = require('mocha');
let chai = require('chai');
let expect = chai.expect;
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
let User = require('../models/user');

describe('Users', function() {
  describe('Accessors', function() {
    it('should be able to return the id for the user', function() {
      let u = new User(10);
      expect(u.id).to.eq(10);
    });
    it('should be able to return a token from prior security operations');
    it('should be able to return errors for the user', function() {
      let u = new User(100);
      u.add_error('TESTING');
      expect(u.errors).to.deep.equal(['TESTING'])
    });
  });
  describe('Security functions', function() {
    it('should be able to log into the user given the right password');
    it('should not be able to log into the user with the wrong password');
    it('should be able to create a new user');
    it('should be able to load data for a user given the id');
    it('should be able to locate a user by email');
    it('should return null for an email not associated with a user')
    it('should be able to disable a user');
    it('should be able to enable a user');
    it('should be able to change the password of a user');
    it('should be able to subscribe a user to the mailling list');
  });
});
