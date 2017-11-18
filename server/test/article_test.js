let mocha = require('mocha');
let chai = require('chai');
let expect = chai.expect;
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
let Article = require('../models/article');

describe('Article', function() {
  describe('basic access', function() {
    it('can return a count for all articles', async function() {
      // The below assumes the current test data, new test data will require changes
      expect(await Article.count()).to.equal(33);
    });
    it('can return a count for articles with a tag');
    it('can return the list of all tags in use', async function() {
      // The below assumes the current test data, new test data will require changes
      expect(await Article.count('test')).to.equal(0);
      expect(await Article.count('Article')).to.equal(16);
      expect(await Article.count('Articles')).to.equal(1);
      expect(await Article.count('Challenge')).to.equal(1);
      expect(await Article.count('Create')).to.equal(15);
    });
  });
})
