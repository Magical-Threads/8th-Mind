let mocha = require('mocha');
let chai = require('chai');
let expect = chai.expect;
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

before(function() {
  let {app, server} = require('../index.js');
  server = require('http-shutdown')(server);
  global.a = app;
  global.s = server;
});
after(async function() {
  // console.log('@@@@ Terminating server');
  // s.close();
  s.shutdown(function() {
    // console.log('@@@@ Server shutdown');
  })
});

describe("server setup", function() {
  it("starts up in tests", async function() {
    return chai.request(a)
    .get('/ping')
    .then((res) => {
      // console.log('@@@@ Verifying end conditions');
      expect(res).to.exist
      expect(res.body).to.deep.equal({success: true})
    });
  });
});
