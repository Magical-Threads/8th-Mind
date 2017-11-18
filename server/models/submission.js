let db = require('../db');
let Base = require('./base');

/**
 * Class for submissions to articles.
 */
class Submission extends Base {
  /**
   * Create a submission for an id.  If the id is not known
   * use -1.
   * @param {int} id - The id of the submission or -1
   */
  constructor(id) {
    super(id);
  }

  /**
   * Create a new submission from the values in this object.
   * articleID and userID must be set on this object.
   */
  async create() {
    return new Promise((resolve, reject) => {
      db.query("INSERT INTO article_submissions SET ?", this.serialized, (err, result) => {
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

module.exports = Submission;
