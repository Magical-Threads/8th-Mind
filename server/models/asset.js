const db = require('../db');
const Base = require('./base');
const path = require('path');
const config = require('../config/index');
const fse = require('fs-extra');

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
   * Copy an asset from a url to the app storage area.
   * @param {string} url - The url holding the asset
   * @param {string} destination - The storage location to receive the asset
   */
  static async copy_url_to_storage(url, destination) {
    return new Promise((resolve, reject) => {
      var curl = fs.createWriteStream(destination);
      http.get(url, (response) => {
        // todo: error handling
        response.pipe(curl);
        resolve();
      });
    });
  }
  /**
   * Copy a local file from one location to another.
   * @param {string} sourcePath - The file location currently
   * @param {string} destinationPath - Where the file will be copied
   */
  static async copy_local_file(sourcePath, destinationPath) {
    return new Promise((resolve, reject) => {
      fse.copy(sourcePath, destinationPath, (err) => {
        if (err) {
          console.error('#### Error in copying local file', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
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
      fse.unlinkSync(full_path);
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
