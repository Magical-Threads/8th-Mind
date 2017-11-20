let mocha = require('mocha');
let chai = require('chai');
let expect = chai.expect;
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
let support = require('./support');

let db = require('../db');
let Article = require('../models/article');
let Submission = require('../models/submission');
let User = require('../models/user');
let Asset = require('../models/asset');

describe('Submission', function() {
  before(async function() {
    await support.clear_users();
    await support.register_users();
  });
  beforeEach(async function() {
    await support.clear_submissions();
    await support.clear_assets();
  });
  it('should be able to create assets for a submission', async function() {
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
    expect(asset).to.exist;
    expect(asset.id).to.be.above(0);
  });
  it('should be able to delete all assets from a submission', async function() {
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
      assetPath: ''
    });
    asset = await asset.create();
    expect(asset).to.exist;
    expect(asset.id).to.be.above(0);
    asset = new Asset(-1);
    asset.set({
      articleSubmissionID: sub.id,
      caption: 'TESTING',
      assetPath: ''
    });
    asset = await asset.create();
    expect(asset).to.exist;
    expect(asset.id).to.be.above(0);
    let assets = await sub.assets();
    expect(assets.length).to.equal(2);
    await sub.delete_all_assets();
    assets = await sub.assets();
    expect(assets.length).to.equal(0);
  });
});
