const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const support = require('./support');

const User = require('../models/user');

describe('Users', function() {
  before(async function() {
    await support.clear_users();
    await support.register_users();
  });
  describe('Accessors', function() {
    it('should be able to return the id for the user', function() {
      let u = new User(10);
      expect(u.id).to.eq(10);
    });
    it('should be able to return a token from prior security operations', function() {
      let u = new User(100);
      u._token = 'ABCDEFG';
      expect(u.token).to.equal('ABCDEFG');
    });
    it('should be able to return errors for the user', function() {
      let u = new User(100);
      u.add_error('TESTING');
      expect(u.errors).to.deep.equal(['TESTING'])
    });
    it('should be able to record user avatar, bio URL and location fields', async function() {
      let u = await (await User.find(support.test_users.fred.userEmail)).set({
        avatar: '',
        bio: 'I was a quary employee for many years.',
        url: '',
        location: 'bedrock'
      }).save();
      expect(u.userFirstName).to.equal(support.test_users.fred.userFirstName);
      expect(u.userLastName).to.equal(support.test_users.fred.userLastName);
      expect(u.avatar).to.equal('');
      expect(u.bio).to.equal('I was a quary employee for many years.');
      expect(u.url).to.equal('');
      expect(u.location).to.equal('bedrock');
      let u2 = await (new User(u.id)).load();
      expect(u2.userFirstName).to.equal(support.test_users.fred.userFirstName);
      expect(u2.userLastName).to.equal(support.test_users.fred.userLastName);
      expect(u2.avatar).to.equal('');
      expect(u2.bio).to.equal('I was a quary employee for many years.');
      expect(u2.url).to.equal('');
      expect(u2.location).to.equal('bedrock');
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
