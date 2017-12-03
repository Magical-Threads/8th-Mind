const db = require('../db');
const Base = require('./base');
const Asset = require('./asset');
const Response = require('./response')

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
      db.query("SELECT S.*, "+
        " IF(U.displayName IS NULL, CONCAT(U.userFirstName, ' ', U.userLastName), U.displayName)" +
    		"	  AS `userDisplayName` " +
        "	FROM article_submission S" +
        "	INNER JOIN users U" +
    		"   ON S.userID = U.userID " +
        " WHERE articleSubmissionID = ? LIMIT 1",
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
   * Load vote data for this submission relative to a specific user.  The fields
   * upvote and totalVotes will be set relative to the provided user, and all users
   * respectively.
   * @param {User} user - the user for reference
   */
  async loadVotes(user) {
    let c = await (new Promise((resolve, reject) => {
      db.query("SELECT count(*) as c FROM article_submission_response "+
        " WHERE articleSubmissionID = ? and userID = ?", [this.id, user.id], (err, result) => {
          if (err) {
            console.error('#### Error in query', err);
            reject(err);
          } else {
            resolve(result[0].c);
          }
        })
    }));
    this.upvote = c > 0;
    let tot = await (new Promise((resolve, reject) => {
      db.query("SELECT count(*) as c FROM article_submission_response "+
        " WHERE articleSubmissionID = ? and responseType = 'Upvote'", this.id, (err, result) => {
          if (err) {
            console.error('#### Error in query', err);
            reject(err);
          } else {
            resolve(result[0].c);
          }
        })
    }));
    this.totalUpvotes = tot;
  }
  /**
   * Delete the submission from the database.
   */
  async delete_submission(user) {
    await this.delete_all_assets();
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
   * Return the assets for this submission owned by the provided user ID
   */
  async assets_for_user(userID) {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM article_submission_asset ASA "+
      "		INNER JOIN article_submission ASub " +
  		"		 ON (ASA.articleSubmissionID = ASub.articleSubmissionID and ASub.userID = ?)" +
      "WHERE ASA.articleSubmissionID = ?",
        [userID, this.id], (err, result) => {
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
    let assets = await this.assets();
    for (let a of assets) {
      await a.delete_uploads();
    }
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
  /**
   * Return the response for a given user.
   * @param {User} user - the user to obtain the response
   * @return {Reponse} - The response
   */
  async response_for(user) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM article_submission_response WHERE articleSubmissionID = ? and userID = ?',
        [this.id, user.id], (err, result) => {
        if (err) {
          console.error('#### Error in database query', err);
          reject(err);
        } else if (result && result.length > 0) {
          let response = new Response(result[0].articleSubmissionResponseID).set(result[0]);
          resolve(response);
        } else {
          resolve(null);
        }
      });
    });
  }
}

module.exports = Submission;
