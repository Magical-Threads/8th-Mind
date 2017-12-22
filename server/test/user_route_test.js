const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const support = require('./support');

const User = require('../models/user');

const userProfile = {
  avatar: '',
  bio: 'I was a quary employee for many years.',
  url: '',
  location: 'bedrock'
};

describe('Users', function() {
  before(async function() {
    await support.clear_users();
    await support.register_users();
    let u = await (await User.find(support.test_users.fred.userEmail)).set(userProfile).save();
  });
  it('Will not return user data if not logged in', async function() {
    let u = await (await User.find(support.test_users.fred.userEmail));
    await chai.request(a)
    .get('/users/'+u.id)
    .then(async (res) => {
      throw '#### Should not get here'
    }).catch(async (err) => {
      expect(err).to.exist;
      expect(err.status).to.equal(401);
    });
  });
  it('Will not return user data for another user', async function() {
    let u = await (await User.find(support.test_users.fred.userEmail));
    let u2 = await (await User.find(support.test_users.bambam.userEmail));
    expect(u).to.exist;
    expect(u2).to.exist;
    let token = await chai.request(a)
    .post('/login')
    .send({
      username: u.userEmail,
      password: 'wilma'
    })
    .then(async (res) => {
      expect(res).to.exist;
      expect(res.status).to.equal(200);
      expect(res.body.access_token).to.exist;
      return res.body.access_token
    }).catch((err) => {
      console.error('#### Unexpected error',err);
      throw err;
    });
    expect(token).to.exist;
    await chai.request(a)
    .get('/users/'+u2.id)
    .set('authorization', token)
    .then(async (res) => {
      throw '#### Should not get here'
    }).catch(async (err) => {
      expect(err).to.exist;
      expect(err.response).to.exist;
      expect(err.response.status).to.equal(401);
    });
  });
  it('Can retrieve user info including profile data', async function() {
    let u = await (await User.find(support.test_users.fred.userEmail));
    expect(u).to.exist;
    let token = await chai.request(a)
    .post('/login')
    .send({
      username: u.userEmail,
      password: 'wilma'
    })
    .then(async (res) => {
      expect(res).to.exist;
      expect(res.status).to.equal(200);
      expect(res.body.access_token).to.exist;
      return res.body.access_token
    }).catch((err) => {
      console.error('#### Unexpected error',err);
      throw err;
    });
    expect(token).to.exist;
    await chai.request(a)
    .get('/users/'+u.id)
    .set('authorization', token)
    .then(async (res) => {
      expect(res).to.exist;
      expect(res.status).to.equal(200);
      expect(res.body.data.userFirstName).to.equal(support.test_users.fred.userFirstName);
      expect(res.body.data.userLastName).to.equal(support.test_users.fred.userLastName);
      expect(res.body.data.userEmail).to.equal(support.test_users.fred.userEmail);
      expect(res.body.data.bio).to.equal(userProfile.bio);
      expect(res.body.data.url).to.equal(userProfile.url);
      expect(res.body.data.location).to.equal(userProfile.location);
      expect(res.body.data.avatar).to.equal(userProfile.avatar);
    }).catch(async (err) => {
      console.error('#### unexpected error in getting user data', err);
      throw err;
    });
  });
  it('Can update user profile info and not internal fields', async function() {
    let u = await (await User.find(support.test_users.fred.userEmail));
    expect(u).to.exist;
    let token = await chai.request(a)
    .post('/login')
    .send({
      username: u.userEmail,
      password: 'wilma'
    })
    .then(async (res) => {
      expect(res).to.exist;
      expect(res.status).to.equal(200);
      expect(res.body.access_token).to.exist;
      return res.body.access_token
    }).catch((err) => {
      console.error('#### Unexpected error',err);
      throw err;
    });
    expect(token).to.exist;
    u.set({url: 'test.net', userPassword: null});
    await chai.request(a)
    .put('/users/'+u.id)
    .send({user: u.serialized})
    .set('authorization', token)
    .then(async (res) => {
      expect(res).to.exist;
      expect(res.status).to.equal(200);
      await u.load();
      expect(u.url).to.equal('test.net');
      expect(u.userPassword).to.exist;
    }).catch(async (err) => {
      console.error('#### unexpected error in getting user data', err);
      throw err;
    });
  });
});
