const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const db = require('../db');
const User = require('../models/user');
const glob = require('glob');
const path = require('path');
const config = require('../config/index');
const fs = require('fs');

let test_users = {
  fred: {
    userFirstName: 'Fred',
    userLastName: 'Flintstone',
    userEmail: 'fred@bedrock.net'
  },
  bambam: {
    userFirstName: 'Bambam',
    userLastName: 'Flintstone',
    userEmail: 'bb@bedrock.net'
  }
}
async function clear_users() {
  await new Promise((resolve, reject) => {
    let users = Object.values(test_users);
    let placeholders = users.map(u => '?').join(',');
    db.query("DELETE FROM users WHERE userEmail in ("+placeholders+")",
      users.map(u => u.userEmail),
      (err, users, fields) => {
      expect(err).to.not.exist;
      resolve();
    });
  });
}
async function register_users() {
  for (let test_user of Object.values(test_users)) {
    let u = await User.register(test_user.userFirstName, test_user.userLastName,
      test_user.userEmail, 'wilma');
    await User.validate_email(u.emailConfirmationToken);
  }
}
async function clear_submissions() {
  await new Promise((resolve, reject) => {
    db.query("DELETE FROM article_submission WHERE title = 'TESTING'",
      (err, results) => {
      expect(err).to.not.exist;
      resolve();
    });
  });
}
async function clear_assets() {
  await new Promise((resolve, reject) => {
    db.query("DELETE FROM article_submission_asset WHERE caption = 'TESTING'",
      (err, results) => {
      expect(err).to.not.exist;
      resolve();
    });
  });
}
async function clear_asset_storage() {
  await new Promise((resolve, reject) => {
    glob(path.join(config.storageDir, '*Beach.png'), (err, files) => {
      try {
        if (err) {
          console.error('#### Error in cleaning up storage', err);
          reject(err);
        } else {
          for (let f of files) {
            fs.unlinkSync(f);
          }
        }
        resolve();
      } catch (err2) {
        console.error('#### error in removing asset files', err2);
        reject(err2);
      }
    });
  });
}

async function clear_responses() {
  await new Promise((resolve, reject) => {
    db.query("DELETE FROM article_submission_response",
      (err, results) => {
      expect(err).to.not.exist;
      resolve();
    });
  });
}

module.exports = {
  clear_users,
  clear_submissions,
  clear_assets,
  register_users,
  test_users,
  clear_asset_storage,
  clear_responses
}
