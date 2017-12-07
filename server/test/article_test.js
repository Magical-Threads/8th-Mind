let mocha = require('mocha');
let chai = require('chai');
let expect = chai.expect;
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
let support = require('./support');

let db = require('../db');
let Article = require('../models/article');
let User = require('../models/user');

describe('Article', function() {
  before(async function() {
    await support.clear_users();
    await support.register_users();
  });
  beforeEach(async function() {
    await support.clear_submissions();
    await support.clear_assets();
  });
  describe('basic access', function() {
    it('can return a count for all articles', async function() {
      // The below assumes the current test data, new test data will require changes
      expect(await Article.count()).to.equal(33);
    });
    it('can return a count for articles with a tag', async function() {
      // The below assumes the current test data, new test data will require changes
      expect(await Article.count('test')).to.equal(0);
      expect(await Article.count('Article')).to.equal(16);
      expect(await Article.count('Articles')).to.equal(1);
      expect(await Article.count('Challenge')).to.equal(1);
      expect(await Article.count('Create')).to.equal(15);
    });
    it('can return the list of all tags in use', async function() {
      // The below assumes the current test data, new test data will require changes
      expect(await Article.all_tags()).to.deep.equal([
        'Article', 'Articles', 'Challenge', 'Create'
      ]);
    });
    it('can return a list of articles on a page', async function() {
      let articles = await Article.articles_on_page(1,3);
      expect(articles).to.exist;
      expect(articles.length).to.equal(3);
      expect(articles.map(a => a.articleID)).to.deep.equal(
        [56,53,52]);
      expect(articles.map(a => a.articleTags)).to.deep.equal(
        ['Article', 'Article','Create']);
      articles = await Article.articles_on_page(2,5);
      expect(articles).to.exist;
      expect(articles.length).to.equal(5);
      expect(articles.map(a => a.articleID)).to.deep.equal(
        [45, 49, 50, 44, 43]);
      expect(articles.map(a => a.articleTags)).to.deep.equal(
        ['Create', 'Article','Articles', 'Create', 'Article']);
    });
    it('can return a list of articles with a given tag on a page', async function() {
      let articles = await Article.articles_on_page(1,3, 'Article');
      expect(articles).to.exist;
      expect(articles.length).to.equal(3);
      expect(articles.map(a => a.articleID)).to.deep.equal(
        [56,53,51]);
      expect(articles.map(a => a.articleTags)).to.deep.equal(
        ['Article', 'Article','Article']);
      articles = await Article.articles_on_page(2,5, 'Article');
      expect(articles).to.exist;
      expect(articles.length).to.equal(5);
      expect(articles.map(a => a.articleID)).to.deep.equal(
        [43, 40, 39, 37, 35]);
      expect(articles.map(a => a.articleTags)).to.deep.equal(
        ['Article', 'Article','Article', 'Article', 'Article']);
    })
    it.only('can return a list of articles with a given tag on a page based on start date', async function() {
      let art = await (new Article(37)).load();
      await new Promise((resolve, reject) => {
        db.query('UPDATE articles SET articleStartDate = ? WHERE articleID = 37',
          new Date(1,1,3000), (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
      try {
        let articles = await Article.articles_on_page(1,3, 'Article');
        expect(articles).to.exist;
        expect(articles.length).to.equal(3);
        expect(articles.map(a => a.articleID)).to.deep.equal(
          [56,53,51]);
        expect(articles.map(a => a.articleTags)).to.deep.equal(
          ['Article', 'Article','Article']);
        articles = await Article.articles_on_page(2,5, 'Article');
        expect(articles).to.exist;
        expect(articles.length).to.equal(5);
        expect(articles.map(a => a.articleID)).to.deep.equal(
          [43, 40, 39, 35, 32]);
        expect(articles.map(a => a.articleTags)).to.deep.equal(
          ['Article', 'Article','Article', 'Article', 'Article']);
      } finally {
        await new Promise((resolve, reject) => {
          db.query('UPDATE articles SET articleStartDate = ? WHERE articleID = 37',
            art.articleStartDate, (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
      }
    })
  });
})
