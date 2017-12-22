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
    		"		WHERE articles.articleStatus='Active' and articles.articleStartDate <= ? "+tag_phrase, new Date(), (err, all) => {
        if (err) {
          reject(err);
        } else {
          resolve((all && all.length > 0) ? all[0]['total'] : 0);
        }
      });
    });
  }
  /**
   * Return the set of articles that are on a select page, and which optionally
   * have a specified tag.
   * @param {int} page - The page to retrieve
   * @param {int} per_page - The number of entries per page
   * @param {string} tag - optional tag value to limit results to
   * @param {int} time - The hour 0-23 (time of day) articles are started on their start date
   * @return {Article[]} - articles matching the tag on the specified page
   */
  static async articles_on_page(page, per_page, tag, time) {
    if (!page || page < 1) { page = 1; }
  	if (!per_page) { per_page = 10; }

  	let offset = (page - 1) * per_page;
  	let qparams = [offset, per_page];

  	let tag_phrase = '';
  	if (tag) {
      tag_phrase = ' AND articles.articleTags=? ';
  		qparams.unshift(tag);
  	}
    time = (time ? time : 9)
    let d = new Date();
    let tz = d.getTimezoneOffset() == 0 ? -8 : 0 // offset for PDT if server is UTC
    if (d.getHours()+tz < time) {
      d.setDate(d.getDate()-1);
    }
    qparams.unshift(d.getFullYear()+'.'+(d.getMonth()+1)+'.'+d.getDate());

  	// console.warn("@@@@@@ tag: ",tag," phrase: ",tag_phrase);
    console.warn('@@@@ Time filter: ',time,' params: ',qparams)

  	// todo: determine if we still need a left join here (will there ever be orphan articles with no userID?) -RJD
  	let query = "SELECT articles.articleID, articles.articleTitle, "+
  		" articles.articleDescription, articles.articleAllowSubmission, " +
  		" articles.articleImage, articles.articleTags, users.userFirstName, "+
  		" users.userLastName," +
  		" articles.articleStartDate " +
  		" FROM articles " +
  		" LEFT JOIN users on articles.userID=users.userID " +
  		" WHERE articles.articleStatus='Active' and articles.articleStartDate <= ? " +
  		tag_phrase +
  		" ORDER BY articleStartDate DESC " +
  		" LIMIT ?,?";

  	// console.log("@@@@ query string: '"+query+"' params: ",qparams)

    return new Promise((resolve, reject) => {
    	db.query(query, qparams, (err, result) => {
        if (err) {
          console.error('#### Error in query for articles', err);
          reject(err);
        } else {
          let articles = result.map(r => (new Article(r.articleID)).set(r));
          // console.log('@@@@ Matched articles: ',articles);
          resolve(articles);
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
        } else if (result && result.length < 1) {
          resolve(null);
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
        "		FROM article_submission submissions "+
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
  /**
   * return the list of submissions for this article, and the votes from all users
   * up and down, and the up/down vote for the provided user.
   * @param {User} user - the user to report on specific voting status
   * @return {Submission[]} - The submissions for this article
   */
  async submissions_viewing_user(user) {
    return new Promise((resolve, reject) => {
      var sql = "SELECT S.articleSubmissionID, S.articleID, "+
        "S.userID, S.title, S.thumbUrl, S.createdAt, " +
        "IF(U.displayName IS NULL, " +
          " CONCAT(U.userFirstName, ' ', U.userLastName)," +
          " U.displayName) as `userDisplayName`, " +
        "(SELECT count(articleSubmissionResponseID)" +
          "FROM article_submission_response " +
          "WHERE articleSubmissionID = S.articleSubmissionID " +
          " and responseType = 'Upvote') AS `upvotes`, " +
        "(SELECT count(articleSubmissionResponseID) " +
          "FROM article_submission_response " +
          "WHERE articleSubmissionID = S.articleSubmissionID " +
          " and responseType = 'Downvote') AS `downvotes`, " +
  			"IF(R.articleSubmissionResponseID IS NULL,'false','true') as `userLiked`" +
  		  "FROM article_submission AS `S` " +
  		  "INNER JOIN users AS `U`" +
  		    "ON S.userID = U.userID " +
  			"LEFT JOIN article_submission_response AS `R` " +
  				"ON (S.articleSubmissionID = R.articleSubmissionID "+
            "AND R.userID = '"+user.id+"')" +
  				"WHERE S.articleID = '" + this.id + "' " +
  		  "ORDER BY createdAt";
      db.query(sql, (err, subs) => {
        if (err) {
          console.log('#### Error in querying database: ',err);
          reject(err);
        } else {
          let result = subs.map((s) => {
            let sub = new Submission(s["articleSubmissionID"]);
            sub.set(s);
            sub.upvote = (s.userLiked == 'true');
            sub.totalUpvotes = s.upvotes - s.downvotes;
            sub.set({submissionTitle: sub.title});  // compatibility
            return sub;
          })
          resolve(result);
        }
      })

    });
  }
}

module.exports = Article;
