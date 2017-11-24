const db = require('../db');
const Base = require('./base');
const path = require('path');
const config = require('../config/index');
const fs = require('fs');

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

  /**
   * If the asset has an upload vs. a public url remove it from the server.
   */
  async delete_uploads() {
    if (this.assetPath && this.assetPath != '') {
      const full_path = path.join(config.storageDir, this.assetPath);
      fs.unlinkSync(full_path);
    }
  }

  /**
   * Delete the asset and any uploads.
   */
  async delete() {
    await new Promise((resolve, reject) => {
      db.query("DELETE FROM article_submission_asset WHERE articleSubmissionAssetID = ?",
      this.id, (err, result) => {
        if (err) {
          console.error('#### Error in deleting asset record in db: ',err);
          reject(err);
        } else {
          resolve();
        }
      })
    })
    await this.delete_uploads();
  }
}

module.exports = Asset;
