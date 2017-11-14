let mocha = require('mocha');
let chai = require('chai');
let expect = chai.expect;
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('article routes', function() {
  describe('basic access', function() {
    it('should allow an article to be created');
    it('should allow an article to be deleted');
    it('should be able to return a list of articles');
    it('should be able to return the details of an article');
    it('should be able to return articles matching a specific tag');
  });

  describe('submission routes', function() {
    it('should allow submissions to be created for an article, if such is enabled');
    it('should not allow submissions to be created for an article, if such is disabled');
    it('should be able to return a list of submissions for an article');
    it('should be able to return details of a submission for an article');

    describe('asset routes', function() {
      it('should be able to add assets to a submission');
      it('should be able to remove assets from a submission');
      it('should be able to list the assets for a submission');
      it('should be able to return details of an asset for a submission');
    });
  });
});
