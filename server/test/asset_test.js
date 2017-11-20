let mocha = require('mocha');
let chai = require('chai');
let expect = chai.expect;
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

let db = require('../db');
let Article = require('../models/article');
let Submission = require('../models/submission');
let User = require('../models/user');
let Asset = require('../models/asset');

let test_user = {
  userFirstName: 'Fred',
  userLastName: 'Flintstone',
  userEmail: 'fred@bedrock.net'
};

describe('Submission', function() {
  before(async function() {
    await new Promise((resolve, reject) => {
      db.query("DELETE FROM users WHERE userEmail = ?", test_user.userEmail,
        (err, users, fields) => {
        expect(err).to.not.exist;
        resolve();
      });
    });
    let u = await User.register(test_user.userFirstName, test_user.userLastName,
      test_user.userEmail, 'wilma');
    await User.validate_email(u.emailConfirmationToken);
  });
  beforeEach(async function() {
    await new Promise((resolve, reject) => {
      db.query("DELETE FROM article_submission WHERE title = 'TESTING'",
        (err, results) => {
        expect(err).to.not.exist;
        resolve();
      });
    });
    await new Promise((resolve, reject) => {
      db.query("DELETE FROM article_submission_asset WHERE caption = 'TESTING'",
        (err, results) => {
        expect(err).to.not.exist;
        resolve();
      });
    });
  });
  it('should be able to create assets for a submission', async function() {
    let u = await User.login(test_user.userEmail, 'wilma');
    let article = await (new Article(53)).load();
    await article.enable_submissions();
    let sub = new Submission(-1);
    sub.set({
      title: 'TESTING',
      articleID: article.id, userID: u.id})
    sub = await sub.create();
    let asset = new Asset(-1);
    asset.set({
      articleSubmissionID: sub.id,
      caption: 'TESTING',
      // assetType: '',
      assetPath: ''
    })
  });
  it('should be able to delete assets from a submission');
});
