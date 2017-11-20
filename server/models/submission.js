let db = require('../db');
let Base = require('./base');
let Asset = require('./asset');

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
      db.query("INSERT INTO article_submission SET ?", this.serialized, (err, result) => {
        if (err) {
          reject(err);
        } else {
          this._id = result.insertId;
          resolve(this);
        }
      });
    })
  }
  /**
   * Load the details of a submission from the database.
   */
  async load() {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM article_submission WHERE articleSubmissionID = ?",
        this.id, (err, result) => {
          if (err) {
            console.log('#### error in database query: ',err);
            reject(err);
          } else if (result && result.length > 0) {
            let sub = this.set(result[0]);
            resolve(sub);
          } else {
            this._errors = ['Submission not found'];
            resolve(null);
          }
        })
    });
  }
  /**
   * Delete the submission from the database.
   */
  async delete_submission(user) {
    return new Promise((resolve, reject) => {
      let sql = "	DELETE " +
    		" FROM article_submission" +
    		"	WHERE articleSubmissionID = ?" +
    		"	 and articleID = ?" +
    		"	 and userID = ?" +
    		" LIMIT 1";
      db.query(sql, [this.id, this.articleID, user.id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      })
    });
  }
  /**
   * Return the assets for the submission.
   */
  async assets() {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM article_submission_asset WHERE articleSubmissionID = ?",
        this.id, (err, result) => {
        if (err) {
          console.error("#### Error in database query ",err);
          reject(err);
        } else {
          let assets = result.map(a => (new Asset(a.articleSubmissionAssetID)).set(a))
          resolve(assets);
        }
      });
    })
  }
  /**
   * Delete all assets for this submission.
   */
  async delete_all_assets() {
    return new Promise((resolve, reject) => {
      db.query("DELETE FROM article_submission_asset WHERE articleSubmissionID = ?",
        this.id, (err, result) => {
        if (err) {
          console.error('#### Error in deleting assets ',err);
          reject(err);
        } else {
          resolve(result);
        }
      })
    })
  }
}

module.exports = Submission;
