let mocha = require('mocha');
let chai = require('chai');
let expect = chai.expect;
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

let db = require('../db');
let User = require('../models/user');

let test_user = {
  userFirstName: 'Fred',
  userLastName: 'Flintstone',
  userEmail: 'fred@bedrock.net'
};

describe('Security Routes', function() {
  beforeEach(async function() {
    return new Promise((resolve, reject) => {
      db.query("DELETE FROM users WHERE userEmail = ?", test_user.userEmail,
        (err, users, fields) => {
          expect(err).to.not.exist;
        })
      resolve();
    });
  });
  it('should allow login to return a token', async function() {
    let u = await User.register(
      test_user.userFirstName, test_user.userLastName,
      test_user.userEmail, 'wilma');
    await User.validate_email(u.emailConfirmationToken);
    await chai.request(a)
    .post('/login')
    .send({
      username: test_user.userEmail,
      password: 'wilma'
    })
    .then(async (res) => {
      expect(res).to.exist;
      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);
      expect(res.body.userID).to.equal(u.id);
      expect(res.body.userFirstName).to.equal(u.userFirstName);
      expect(res.body.userLastName).to.equal(u.userLastName);
      expect(res.body.access_token).to.exist;
    }).catch(async (err) => {
      console.error('#### Error in test: ',err);
      throw err;
    });
  });
  it('should reject login with an incorrect password', async function() {
    let u = await User.register(
      test_user.userFirstName, test_user.userLastName,
      test_user.userEmail, 'wilma');
    await User.validate_email(u.emailConfirmationToken);
    await chai.request(a)
    .post('/login')
    .send({
      username: test_user.userEmail,
      password: 'betty'
    })
    .then(async (res) => {
      expect(res).to.exist;
      expect(res.status).to.equal(401);
      expect(res.body.success).to.equal(false);
      expect(res.body.access_token).to.not.exist;
    }).catch(async (err) => {
      expect(err.response).to.exist;
      expect(err.response.status).to.equal(401);
      expect(err.response.body.success).to.equal(false);
    });
  });
  it('should allow registering a new user without a token', function() {
      return chai.request(a)
      .post('/register')
      .send({
        userFirstName: test_user.userFirstName,
        userLastName: test_user.userLastName,
        userEmail: test_user.userEmail,
        userPassword: 'wilma'
      })
      .then(async (res) => {
        // console.log('@@@@ Verifying end conditions');
        expect(res).to.exist
        let emailStatus='Unverified';
        let userStatus='Pending';
        expect(res.body.success).to.equal(true);
        expect(res.body.data.userID).to.exist;
        expect(res.body.data.emailConfirmationToken).to.exist;
        expect(res.body).to.deep.equal({
          success: true,
          data: {
            userID: res.body.data.userID,
            emailConfirmationToken: res.body.data.emailConfirmationToken,
            userFirstName: 'Fred',
            userLastName: 'Flintstone',
            userEmail: 'fred@bedrock.net',
            userStatus:userStatus,
            emailStatus:emailStatus,
            userRole:3
          }
        });
        let user = await User.find(test_user.userEmail);
        expect(user).to.exist;
        expect(user.userFirstName).to.equal(test_user.userFirstName);
        expect(user.userLastName).to.equal(test_user.userLastName);
        expect(user.userEmail).to.equal(test_user.userEmail);
      });
  });
  it('should not allow registering a user to the email of an existing user', async function() {
    let u = await User.register(
      test_user.userFirstName, test_user.userLastName,
      test_user.userEmail, 'wilma');
    await chai.request(a)
    .post('/register')
    .send({
      userFirstName: test_user.userFirstName,
      userLastName: test_user.userLastName,
      userEmail: test_user.userEmail,
      userPassword: 'wilma'
    })
    .then(async (res) => {
      expect(res).to.exist;
      expect(res.status).to.equal(422);
      expect(res.body.success).to.equal(false);
      expect(res.body.errors).to.exist;
    }).catch(async (err) => {
      expect(err.response.status).to.equal(422);
      expect(err.response.body).to.exist;
      expect(err.response.body.success).to.equal(false);
      expect(err.response.body.errors).to.exist;
    })
  });
  it('should allow subscribing for emails without being logged in');
  it('should allow subscribing for emails during registration');
  it('should allow a user to activate their account from the activation email', async function() {
    let u = await User.register(
      test_user.userFirstName, test_user.userLastName,
      test_user.userEmail, 'wilma');
    await chai.request(a)
    .get('/users/activate')
    .query({token: u.emailConfirmationToken})
    .then(async (res) => {
      expect(res).to.exist;
      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);
      let u2 = await User.find(u.userEmail);
      expect(u2.id).to.equal(u.id);
      expect(u2.userStatus).to.equal('Active');
      expect(u2.emailStatus).to.equal('Verified');
    }).catch(async (err) => {
      console.error('#### Error in test: ',err);
      throw err;
    });
  });
  it('should not activate a user with the wrong token');
});

describe('User Routes', function() {
  it('should require email to be verified by a user prior to logging in');
  it('should walk the user through forgotten password');
  it('should be able to return the details about a user');
});
