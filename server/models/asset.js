let db = require('../db');
let Base = require('./base');

/**
 * Class for submissions to articles.
 */
class Asset extends Base {
  /**
   * Create an (in memory) asset for an id.  If the id is not known
   * use -1.
   * @param {int} id - The id of the submission or -1
   */
  constructor(id) {
    super(id);
  }

  /**
   * Create a new asset from the values in this object.
   * articleSubmissionID must be set on this object.
   */
  async create() {
    return new Promise((resolve, reject) => {
      db.query("INSERT INTO article_submission_asset SET ?", this.serialized, (err, result) => {
        if (err) {
          reject(err);
        } else {
          this._id = result.insertId;
          resolve(this);
        }
      });
    })
  }
}

module.exports = Asset;
