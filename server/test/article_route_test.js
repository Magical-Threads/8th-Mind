let mocha = require('mocha');
let chai = require('chai');
let expect = chai.expect;
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
let support = require('./support');

let db = require('../db');
let Article = require('../models/article');
let User = require('../models/user');
let Submission = require('../models/submission');
let Asset = require('../models/asset');

describe('article routes', function() {
  before(async function() {
    await support.clear_users();
    await support.register_users();
  });
  beforeEach(async function() {
    await support.clear_submissions();
    await support.clear_assets();
  });
  describe('basic access', function() {
    it('should allow an article to be created');
    it('should allow an article to be deleted');
    it('should be able to return the list of articles', async function () {
      await chai.request(a)
      .get('/articles')
      .then(async (res) => {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.result).to.exist;
        // for (let a of res.body.result) {
        //   console.log('@@@@ Article ',a.articleID, a.userFirstName,
        //     a.userLastName, a.articleTitle, a.articleAllowSubmission);
        // }
        expect(res.body.pagination).to.exist;
        let pagination = res.body.pagination[0];
        expect(res.body.result.length).to.equal(Math.min(pagination.per_page, pagination.total));
        expect(pagination.total_pages).to.equal(pagination.total / pagination.per_page);
      });
    });
    // it('should be able to return the details of an article', async function() {
    //   await chai.request(a)
    //   .get('/article/53')
    //   .then(async (res) => {
    //     expect(res).to.exist;
    //     expect(res.status).to.equal(200);
    //     console.log('@@@@ Result: ',res.body);
    //     expect(res.body.articleID).to.equal(53);
    //     expect(res.body.userFirstName).to.equal('Blaze');
    //     expect(res.body.userLastName).to.equal('Hilario');
    //     expect(res.body.articleAllowSubmissions).to.equal('No');
    //     expect(res.body.articleTitle).to.equal('8 Ways Creators Can Beat Procrastination');
    //   });
    // });
    it('should be able to return articles matching a specific tag', async function() {
      for (tag of await Article.all_tags()) {
        await chai.request(a)
        .get('/articles')
        .query({tag:tag})
        .then(async (res) => {
          expect(res).to.exist;
          expect(res.status).to.equal(200);
          expect(res.body.result).to.exist;
          expect(res.body.pagination).to.exist;
          let pagination = res.body.pagination[0];
          expect(res.body.result.length).to.equal(Math.min(pagination.per_page, pagination.total));
          expect(pagination.total_pages).to.equal(pagination.total / pagination.per_page);
        });
      }
    });
  });

  describe('submission routes', function() {
    it('should allow submissions to be created for an article, if such is enabled', async function() {
      let article = await (new Article(53)).load();
      await article.enable_submissions();
      let u = await User.login(support.test_users.fred.userEmail, 'wilma');
      await chai.request(a)
      .post('/articles/53/submissions/new')
      .set('authorization', u.token)
      .send({submissionTitle: "TESTING"})
      .then(async (res) => {
        expect(res.status).to.equal(200);
        let sub = await article.submission_for_user(u);
        expect(sub).to.exist;
        expect(sub.title).to.equal('TESTING');
      })
    });
    it('should not allow submissions to be created for an article, if such is disabled', async function() {
      let article = await (new Article(53)).load();
      await article.disable_submissions();
      let u = await User.login(support.test_users.fred.userEmail, 'wilma');
      await chai.request(a)
      .post('/articles/53/submissions/new')
      .set('authorization', u.token)
      .send({submissionTitle: "TESTING"})
      .then(async (res) => {
        expect(res.status).to.not.equal(200);
      })
      .catch(async (err) => {
        expect(err.response).to.exist;
        expect(err.response.status).to.equal(422);
      })
    });
    it('should not allow submissions to be created for an article, if user is not logged in', async function() {
      let article = await (new Article(53)).load();
      await article.disable_submissions();
      await chai.request(a)
      .post('/articles/53/submissions/new')
      .send({submissionTitle: "TESTING"})
      .then(async (res) => {
        expect(res.status).to.not.equal(200);
      })
      .catch(async (err) => {
        expect(err.response).to.exist;
        expect(err.response.status).to.equal(401);
      })
    });
    it('should not allow submissions to be created for an article, if user already has a submission', async function() {
      let u = await User.login(support.test_users.fred.userEmail, 'wilma');
      let article = await (new Article(53)).load();
      await article.enable_submissions();
      let sub = new Submission(-1);
      sub.set({
        title: 'TESTING',
        createdAt: new Date(),
        articleID: article.id, userID: u.id})
      await sub.create();
      await chai.request(a)
      .post('/articles/53/submissions/new')
      .set('authorization', u.token)
      .send({submissionTitle: "TESTING"})
      .then(async (res) => {
        expect(res.status).to.not.equal(200);
      })
      .catch(async (err) => {
        expect(err.response).to.exist;
        expect(err.response.status).to.equal(422);
      })
    });
    it('should be able to return a list of submissions for an article', async function() {
      let u = await User.login(support.test_users.fred.userEmail, 'wilma');
      let article = await (new Article(53)).load();
      await article.enable_submissions();
      let sub = new Submission(-1);
      sub.set({
        title: 'TESTING',
        createdAt: new Date(),
        articleID: article.id, userID: u.id})
      await sub.create();
      let subs = await article.submissions_viewing_user(u);
      expect(subs.length).to.equal(1);
      expect(subs[0].title).to.equal('TESTING');
      expect(subs[0].submissionTitle).to.equal('TESTING');
      await chai.request(a)
      .get('/articles/53/submissions')
      .set('authorization', u.token)
      .then(async (res) => {
        expect(res).to.exist;
        expect(res.status).to.equal(200);
        expect(res.body.length).to.equal(1);
        expect(res.body[0].title).to.equal('TESTING');
        expect(res.body[0].submissionTitle).to.equal('TESTING');
      })

    });
    it('should be able to list submissions for a specific user for a specific article');
    it('should be able to return details of a submission for an article');
    it('should be able to delete a submission from the user that created it', async function() {
      let u = await User.login(support.test_users.fred.userEmail, 'wilma');
      let article = await (new Article(53)).load();
      await article.enable_submissions();
      let sub = new Submission(-1);
      sub.set({
        title: 'TESTING',
        articleID: article.id, userID: u.id})
      sub = await sub.create();
      await chai.request(a)
      .delete('/articles/53/submissions/'+sub.id)
      .set('authorization', u.token)
      .then(async (res) => {
        expect(res).to.exist;
        expect(res.status).to.equal(204);
        expect(res.body).to.deep.equal({});
      });
    });
    it('should not be able to delete a submission from another user', async function() {
      let u = await User.login(support.test_users.fred.userEmail, 'wilma');
      let u2 = await User.login(support.test_users.bambam.userEmail, 'wilma');
      let article = await (new Article(53)).load();
      await article.enable_submissions();
      let sub = new Submission(-1);
      sub.set({
        title: 'TESTING',
        articleID: article.id, userID: u2.id})
      sub = await sub.create();
      await chai.request(a)
      .delete('/articles/53/submissions/'+sub.id)
      .set('authorization', u.token)
      .then(async (res) => {
        expect(res.status).to.equal(403);
      })
      .catch(async (err) => {
        expect(err).to.exist;
        expect(err.response).to.exist;
        expect(err.response.status).to.equal(403);
      });
      // verify delete failed
      expect(await sub.load()).to.exist;
    });
    it('should not be able to delete a submission without being logged in');
    it('should not be able to delete a submission if it has assets', async function() {
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
      await chai.request(a)
      .delete('/articles/53/submissions/'+sub.id)
      .set('authorization', u.token)
      .catch(async (res) => {
        expect(res).to.exist;
        expect(res.status).to.equal(409);
      });
    });
    it('should be able to delete a submission with assets if force option enabled', async function() {
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
      await chai.request(a)
      .delete('/articles/53/submissions/'+sub.id)
      .query({force:true})
      .set('authorization', u.token)
      .then(async (res) => {
        expect(res).to.exist;
        expect(res.status).to.equal(204);
        let assets = await sub.assets();
        expect(assets.length).to.equal(0);
        let subs = await article.submissions_viewing_user(u);
        expect(subs.length).to.equal(0);
      });
    });
    describe('asset routes', function() {
      it('should be able to add assets to a submission');
      it('should be able to remove assets from a submission');
      it('should be able to list the assets for a submission');
      it('should be able to return details of an asset for a submission');
    });
  });
});
