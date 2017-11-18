let db = require('../db');
let Base = require('./base');
let Submission = require('./submission');

/**
 * The model class for article manipulation
 */
class Article extends Base {
  /**
   * Constructor for article with id
   * @param {int} id - The article id
   */
  constructor(id) {
    super(id);
  }
  /**
   * Count the number of articles matching a tag or all articles
   * @param {string} tag - tag or null for all articles
   * @return {int} - the count
   */
  static async count(tag) {
    let tag_phrase = tag ? "AND articles.articleTags='"+tag+"' " : "";
    return new Promise((resolve, reject) => {
      db.query("	SELECT count(*) as total" +
    		"		FROM articles " +
    		"		WHERE articles.articleStatus='Active'"+tag_phrase, (err, all) => {
        if (err) {
          reject(err);
        } else {
          resolve((all && all.length > 0) ? all[0]['total'] : 0);
        }
      });
    });
  }
  /**
   * Return the set of tags in use.
   */
  static async all_tags() {
    return new Promise((resolve, reject) => {
      db.query(" SELECT distinct articles.articleTags as tag FROM articles", (err, tags) => {
        if (err) {
          reject(err);
        } else {
          resolve(tags.map(t => t["tag"]));
        }
      })
    })
  }
  /**
   * Load data for an article
   */
  async load() {
    return new Promise((resolve, reject) => {
      let sql = "	SELECT articles.articleID, articles.articleTitle, "+
    		"articles.articleDescription, articles.articleAllowSubmission, " +
    		"		 articles.articleImage, articles.articleTags, users.userFirstName, "+
    		"users.userLastName," +
    		"		 articles.articleStartDate " +
    		"		FROM articles " +
    		"		LEFT JOIN users on articles.userID=users.userID " +
        "   WHERE articleID = ? LIMIT 1"
      db.query(sql, this._id, (err, result, fields) => {
        if (err) {
          console.error('#### Error in query for article: ',err);
          reject(err);
        } else {
          let names = fields.map(f => f.name);
          for (let n of names) {
            this[n] = result[0][n];
          }
          resolve(this);
        }
      });
    });
  }
  /**
   * Locate the submission for a user to this article.
   * @param {User} user - The user
   * @return {Submission} - The submission or null for none
   */
  async submission_for_user(user) {
    return new Promise((resolve, reject) => {
      db.query("	SELECT *" +
        "		FROM article_submissions submissions "+
        "   WHERE submissions.articleID = ? and submissions.userID = ?" +
        "		LIMIT 1", [this.id, user.id], (err, subs) => {
        if (err) {
          reject(err);
        } else if (subs && subs.length > 0) {
          resolve((new Submission(subs.articleSubmissionID)).set(subs[0]));
        } else {
          resolve(null);
        }
      });
    });
  }
  /**
   * allow users to submit to this article.
   */
  async enable_submissions() {
    return new Promise((resolve, reject) => {
      db.query("UPDATE articles SET articles.articleAllowSubmission = 'Yes' "+
        " WHERE articles.articleID = ?", this.id, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        })
    })
  }
  /**
   * do not allow users to submit to this article.
   */
  async disable_submissions() {
    return new Promise((resolve, reject) => {
      db.query("UPDATE articles SET articles.articleAllowSubmission = 'No' "+
        " WHERE articles.articleID = ?", this.id, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        })
    })
  }
}

module.exports = Article;
