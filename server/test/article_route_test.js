const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const chaiString = require('chai-string');
chai.use(chaiString);
const support = require('./support');
const path = require('path');
const fs = require("fs");

const config = require('../config/index');
const db = require('../db');
const Article = require('../models/article');
const User = require('../models/user');
const Submission = require('../models/submission');
const Asset = require('../models/asset');
const Response = require('../models/response');

describe('article routes', function() {
  before(async function() {
    await support.clear_users();
    await support.register_users();
  });
  beforeEach(async function() {
    await support.clear_submissions();
    await support.clear_assets();
    await support.clear_asset_storage();
    await support.clear_responses();
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
    it('should not be able to delete a submission without being logged in', async function() {
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
      .catch(async (res) => {
        expect(res).to.exist;
        expect(res.status).to.equal(401);
      });
    });
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
    it('should be able to record a like for a submission from a user');
    describe('asset routes', function() {
      it('should be able to add assets to a submission', async function() {
        let u = await User.login(support.test_users.fred.userEmail, 'wilma');
        let article = await (new Article(53)).load();
        await article.enable_submissions();
        let sub = new Submission(-1);
        sub.set({
          title: 'TESTING',
          articleID: article.id, userID: u.id
        });
        sub = await sub.create();
        await chai.request(a)
        .post('/articles/53/submissions/'+sub.id+'/asset/new')
        .set('authorization', u.token)
        .field('caption', 'TESTING')
        .field('type', 'Image')
        .attach('assetfile', fs.readFileSync(path.join(__dirname, 'KoLinaBeach.png')), 'KoLinaBeach.png')
        .then(async (res) => {
          expect(res.status).to.equal(200);
          let assets = await sub.assets();
          expect(assets.length).to.equal(1);
          expect(assets[0].assetPath).to.endWith('KoLinaBeach.png');
          expect(fs.existsSync(path.join(config.storageDir,assets[0].assetPath))).to.be.true;
        // }).catch(async (err) => {
        //   console.error('#### Error in test: ',err);
        //   throw err;
        })
      });
      it('should be able to add assets to a submission that already has assets', async function() {
        let u = await User.login(support.test_users.fred.userEmail, 'wilma');
        let article = await (new Article(53)).load();
        await article.enable_submissions();
        let sub = new Submission(-1);
        sub.set({
          title: 'TESTING',
          articleID: article.id, userID: u.id
        });
        sub = await sub.create();
        let asset = await chai.request(a)
        .post('/articles/53/submissions/'+sub.id+'/asset/new')
        .set('authorization', u.token)
        .field('caption', 'TESTING')
        .field('type', 'Image')
        .attach('assetfile', fs.readFileSync(path.join(__dirname, 'KoLinaBeach.png')), 'KoLinaBeach.png')
        .then(async (res) => {
          expect(res.status).to.equal(200);
          let assets = await sub.assets();
          expect(assets.length).to.equal(1);
          expect(assets[0].assetPath).to.endWith('KoLinaBeach.png');
          expect(fs.existsSync(path.join(config.storageDir,assets[0].assetPath))).to.be.true;
          return assets[0];
        });
        let asset2 = await chai.request(a)
        .post('/articles/53/submissions/'+sub.id+'/asset/new')
        .set('authorization', u.token)
        .field('caption', 'TESTING')
        .field('type', 'Image')
        .attach('assetfile', fs.readFileSync(path.join(__dirname, 'KoLinaBeach2.png')), 'KoLinaBeach2.png')
        .then(async (res) => {
          expect(res.status).to.equal(200);
          let assets = await sub.assets();
          expect(assets.length).to.equal(2);
          expect(assets[0].assetPath).to.endWith('KoLinaBeach.png');
          expect(assets[1].assetPath).to.endWith('KoLinaBeach2.png');
          expect(fs.existsSync(path.join(config.storageDir,assets[0].assetPath))).to.be.true;
          return assets[1];
        });
      });
      it('should be able to remove assets from a submission', async function() {
        let u = await User.login(support.test_users.fred.userEmail, 'wilma');
        let article = await (new Article(53)).load();
        await article.enable_submissions();
        let sub = new Submission(-1);
        sub.set({
          title: 'TESTING',
          articleID: article.id, userID: u.id
        });
        sub = await sub.create();
        let asset = await chai.request(a)
        .post('/articles/53/submissions/'+sub.id+'/asset/new')
        .set('authorization', u.token)
        .field('caption', 'TESTING')
        .field('type', 'Image')
        .attach('assetfile', fs.readFileSync(path.join(__dirname, 'KoLinaBeach.png')), 'KoLinaBeach.png')
        .then(async (res) => {
          expect(res.status).to.equal(200);
          let assets = await sub.assets();
          expect(assets.length).to.equal(1);
          expect(assets[0].assetPath).to.endWith('KoLinaBeach.png');
          expect(fs.existsSync(path.join(config.storageDir,assets[0].assetPath))).to.be.true;
          return assets[0];
        })
        await chai.request(a)
        .delete('/articles/53/submissions/'+sub.id+'/asset/'+asset.articleSubmissionAssetID)
        .set('authorization', u.token)
        .then(async (res) => {
          expect(res.status).to.equal(200);
          expect(res.body.affectedRows).to.equal(1);
          expect(fs.existsSync(path.join(config.storageDir,asset.assetPath))).to.be.false;
          let assets = await sub.assets();
          expect(assets.length).to.equal(0);
        })
      });
      it('should be able to list the assets for a submission', async function() {
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
        let asset2 = new Asset(-1);
        asset2.set({
          articleSubmissionID: sub.id,
          caption: 'TESTING',
          assetPath: ''
        });
        asset2 = await asset2.create();
        await chai.request(a)
        .get('/articles/53/submissions/'+sub.id)
        .then((res) => {
          expect(res).to.exist;
          expect(res.status).to.equal(200);
          expect(res.body.assets.map(a => a.articleSubmissionAssetID)).to.deep.equal([asset.id, asset2.id]);
        })
      });
      it('should be able to return details of an asset for a submission');
    });
    describe('up/down vote routes', function() {
      it('should be able to take an up vote for a user for a submission', async function() {
        let u = await User.login(support.test_users.fred.userEmail, 'wilma');
        let article = await (new Article(53)).load();
        await article.enable_submissions();
        let sub = new Submission(-1);
        sub.set({
          title: 'TESTING',
          articleID: article.id, userID: u.id})
        sub = await sub.create();
        await chai.request(a)
        .post('/articles/53/submissions/'+sub.id+'/upvote')
        .set('authorization', u.token)
        .then((res) => {
          expect(res).to.exist;
          expect(res.status).to.equal(200);
        });
        let response = await sub.response_for(u);
        expect(response).to.exist;
        expect(response.responseType).to.equal('Upvote');
      });
      it('should reject an up vote by a user that already has an up vote for a submission', async function() {
        let u = await User.login(support.test_users.fred.userEmail, 'wilma');
        let article = await (new Article(53)).load();
        await article.enable_submissions();
        let sub = new Submission(-1);
        sub.set({
          title: 'TESTING',
          articleID: article.id, userID: u.id})
        sub = await sub.create();
        await (new Response(-1)).set({
          articleSubmissionID: sub.id,
          userID: u.id,
          responseType: 'Upvote',
          createdAt: new Date()
        }).create();
        await chai.request(a)
        .post('/articles/53/submissions/'+sub.id+'/upvote')
        .set('authorization', u.token)
        .then((res) => {
          expect(res).to.not.exist;
        })
        .catch((err) => {
          expect(err).to.exist;
          expect(err.response).to.exist;
          expect(err.response.status).to.equal(422);
        });
      });
      it('should allow deleting an up vote by a user for a submission', async function() {
        let u = await User.login(support.test_users.fred.userEmail, 'wilma');
        let article = await (new Article(53)).load();
        await article.enable_submissions();
        let sub = new Submission(-1);
        sub.set({
          title: 'TESTING',
          articleID: article.id, userID: u.id})
        sub = await sub.create();
        await (new Response(-1)).set({
          articleSubmissionID: sub.id,
          userID: u.id,
          responseType: 'Upvote',
          createdAt: new Date()
        }).create();
        await chai.request(a)
        .delete('/articles/53/submissions/'+sub.id+'/upvote')
        .set('authorization', u.token)
        .then((res) => {
          expect(res).to.exist;
          expect(res.status).to.equal(200);
        })
        let response = await sub.response_for(u);
        expect(response).to.not.exist;
      });
      it('should reject deleting an up vote by a user for a submission without an existing up vote', async function() {
        let u = await User.login(support.test_users.fred.userEmail, 'wilma');
        let article = await (new Article(53)).load();
        await article.enable_submissions();
        let sub = new Submission(-1);
        sub.set({
          title: 'TESTING',
          articleID: article.id, userID: u.id})
        sub = await sub.create();
        await chai.request(a)
        .delete('/articles/53/submissions/'+sub.id+'/upvote')
        .set('authorization', u.token)
        .then((res) => {
          expect(res).to.not.exist;
        })
        .catch((err) => {
          expect(err).to.exist;
          expect(err.response).to.exist;
          expect(err.response.status).to.equal(404);
        });
      });
      it('should return the vote status for the current user when fetching a submission', async function() {
        let u = await User.login(support.test_users.fred.userEmail, 'wilma');
        let u2 = await User.login(support.test_users.bambam.userEmail, 'wilma');
        let article = await (new Article(53)).load();
        await article.enable_submissions();
        let sub = new Submission(-1);
        sub.set({
          title: 'TESTING',
          articleID: article.id, userID: u.id})
        sub = await sub.create();
        await (new Response(-1)).set({
          articleSubmissionID: sub.id,
          userID: u.id,
          responseType: 'Upvote',
          createdAt: new Date()
        }).create();
        await chai.request(a)
        .get('/articles/53/submissions/'+sub.id)
        .set('authorization', u.token)
        .then((res) => {
          expect(res).to.exist;
          expect(res.status).to.equal(200);
          expect(res.body.articleSubmissionID).to.equal(sub.id);
          expect(res.body.userID).to.equal(u.id);
          expect(res.body.userDisplayName).to.equal('Fred Flintstone');
          expect(res.body.upvote).to.equal(true);
          expect(res.body.totalUpvotes).to.equal(1);
        });
        await chai.request(a)
        .get('/articles/53/submissions/'+sub.id)
        .set('authorization', u2.token)
        .then((res) => {
          expect(res).to.exist;
          expect(res.status).to.equal(200);
          expect(res.body.articleSubmissionID).to.equal(sub.id);
          expect(res.body.userID).to.equal(u.id);
          expect(res.body.userDisplayName).to.equal('Fred Flintstone');
          expect(res.body.upvote).to.equal(false);
          expect(res.body.totalUpvotes).to.equal(1);
        });
      });
      it('should return the total up votes a submissions when fetching a submission');
    });
  });
});
