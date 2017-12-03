let db = require('../db');
let Base = require('./base');
let Asset = require('./asset');

/**
 * Class for user reponse to submissions to articles.
 */
class Response extends Base {
  /**
   * Create a submission for an id.  If the id is not known
   * use -1.
   * @param {int} id - The id of the submission or -1
   */
  constructor(id) {
    super(id);
  }
  /**
   * Create a new user response from the values in this object.
   * submissionID and userID must be set on this object.
   */
  async create() {
    return new Promise((resolve, reject) => {
      db.query("INSERT INTO article_submission_response SET ?", this.serialized, (err, result) => {
        if (err) {
          reject(err);
        } else {
          this._id = result.insertId;
          resolve(this);
        }
      });
    });
  }
  /**
   * delete the response.
   */
  async delete() {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM article_submission_response WHERE articleSubmissionResponseID = ? LIMIT 1',
        this.id, (err, result) => {
        if (err) {
          console.log('#### Error in deleting response', err);
          reject(err);
        } else {
          resolve(null);
        }
      });
    });
  }
}

module.exports = Response;
