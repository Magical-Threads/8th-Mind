const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const support = require('./support');

const db = require('../db');
const Article = require('../models/article');
const Submission = require('../models/submission');
const User = require('../models/user');
const Asset = require('../models/asset');
const Response = require('../models/response');

describe('Submission', function() {
  before(async function() {
    await support.clear_users();
    await support.register_users();
  });
  beforeEach(async function() {
    await support.clear_submissions();
    await support.clear_assets();
  });
  it('should be able to create submissions for existing articles', async function() {
    let u = await User.login(support.test_users.fred.userEmail, 'wilma');
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
    sub.userDisplayName = sub2.userDisplayName;
    expect(sub2.serialized).to.deep.equal(sub.serialized);
  });
  it('should be able to delete an existing submission', async function() {
    let u = await User.login(support.test_users.fred.userEmail, 'wilma');
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
    let u = await User.login(support.test_users.fred.userEmail, 'wilma');
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
  it('should be able to load submission data', async function() {
    let u = await User.login(support.test_users.fred.userEmail, 'wilma');
    let article = await (new Article(53)).load();
    await article.enable_submissions();
    let sub = new Submission(-1);
    sub.set({
      title: 'TESTING',
      articleID: article.id, userID: u.id})
    sub = await sub.create();
    let sub2 = await (new Submission(sub.id)).load();
    expect(sub2.id).to.equal(sub.id);
    expect(sub2.userID).to.equal(u.id);
    expect(sub2.userDisplayName).to.equal(u.userFirstName+' '+u.userLastName);
    await sub2.loadVotes(u);
    expect(sub2.upvote).to.equal(false);
    expect(sub2.totalUpvotes).to.equal(0);
    //
    await (new Response(-1)).set({
      articleSubmissionID: sub.id,
      userID: u.id,
      responseType: 'Upvote',
      createdAt: new Date()
    }).create();
    await sub2.loadVotes(u);
    expect(sub2.upvote).to.equal(true);
    expect(sub2.totalUpvotes).to.equal(1);
  });
});
