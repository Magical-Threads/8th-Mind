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
  it('should be able to create submissions for existing articles', async function() {
    let u = await User.login(test_user.userEmail, 'wilma');
    let article = await (new Article(53)).load();
    await article.enable_submissions();
    let sub = new Submission(-1);
    sub.set({
      title: 'TESTING',
      articleID: article.id, userID: u.id})
    sub = await sub.create();
    let sub2 = await (new Submission(sub.id)).load();
    // Verify derived values on returned submission
    expect(sub2.createdAt).to.exist;
    expect(sub2.status).to.equal('Draft');
    expect(sub2.thumbUrl).to.equal(null);
    // copy derived values for comparison
    sub.articleSubmissionID = sub2.id;
    sub.status = sub2.status;
    sub.thumbUrl = sub2.thumbUrl;
    sub.createdAt = sub2.createdAt;
    expect(sub2.serialized).to.deep.equal(sub.serialized);
  });
  it('should be able to delete an existing submission', async function() {
    let u = await User.login(test_user.userEmail, 'wilma');
    let article = await (new Article(53)).load();
    await article.enable_submissions();
    let sub = new Submission(-1);
    sub.set({
      title: 'TESTING',
      articleID: article.id, userID: u.id})
    sub = await sub.create();
    let subs = await article.submissions_viewing_user(u);
    expect(subs.map(s => s.id)).to.deep.equal([sub.id]);
    // Now try to delete it
    let status = await sub.delete_submission(u);
    expect(status.affectedRows).to.equal(1);
    subs = await article.submissions_viewing_user(u);
    expect(subs.map(s => s.id)).to.deep.equal([]);
  });
  it('should be able to delete all assets for a submission', async function() {
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
    });
    asset = await asset.create();
    let assets = await sub.assets();
    expect(assets.length).to.equal(1);
  });
})
