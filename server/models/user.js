let db = require('../db');
let bcrypt = require('bcryptjs');
let crypto = require('crypto');
let transport = require('../mailer');
let jwt = require('jsonwebtoken');
let Base = require('./base');

/**
 * Class for managing users in the system.
 */
class User extends Base {
  /**
   * Create user objects by prividing the user id.
   * @param {int} id - The id of the user
   * @return {User}
   */
  constructor(id) {
    super(id);
    this._token = null;
  }

  /**
   * Return the session token for the user (only available after a login operation)
   * @return {string} - the session token
   */
  get token() {
    return this._token;
  }
  /**
   * Register a new user
   * @param {string} first_name
   * @param {string} last_name
   * @param {string} email
   * @param {string} password
   * @return {User} - return null if user already exists
   */
  static async register(first_name, last_name, email, password) {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10,function(err,salt) {
        if (err) return reject(err);
        bcrypt.hash(password ,salt, function(err,hash) {
          if (err) return reject(err);
          User.find(email).then(async function(user) {
            if (user) {
              resolve(user.add_error("A user with that email address already exists"));
            } else {
              let emailConfirmationToken = crypto.randomBytes(40).toString('hex');
              let emailStatus='Unverified';
              let userStatus='Pending';
              let createdAt = new Date();
              let updatedAt = new Date();

              let ins_user={
                userFirstName:first_name,
                userLastName:last_name,
                userEmail:email,
                userPassword:hash,
                emailConfirmationToken:emailConfirmationToken,
                passwordResetToken:'',
                userRole:3,
                emailStatus:emailStatus,
                userStatus:userStatus,
                createdAt:createdAt,
                updatedAt:updatedAt,
                lastLogin:createdAt
              };

              db.query('INSERT INTO users SET ?',ins_user, function (err, result) {
                if (err) return reject(err);
                let user = new User(result.insertId);
                user.userID = result.insertId;
                user.userFirstName = first_name;
                user.userLastName = last_name;
                user.userEmail = email;
                user.userStatus = userStatus;
                user.emailStatus = emailStatus;
                user.emailConfirmationToken = emailConfirmationToken;
                user.userRole = 3;
                resolve(user);
              });
            }
          });
        });
      });
    });
  }
  /**
   * Log a user into the system
   * @param {string} email
   * @param {string} password
   * @return {User}
   */
  static async login(email, password) {
    let user = await User.find(email)
    if (user == null) {
      return null;
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.userPassword, function(err, isMatch) {
        if (isMatch) {
          if (user.emailStatus == 'Unverified') {
            resolve(user.add_error("Email is not Verified"));
          } else if (user.userStatus != 'Active') {
            resolve(user.add_error("Account Inactive, Please Contact Administrator."));
          } else if (user.userRole != 3) {
            resolve(user.add_error("Access Denied"));
          } else {
            let lastLogin = new Date();
            let user_tok = {
              userID: user.id,
              userEmail: user.userEmail
            };
            let token = jwt.sign(user_tok, 'secret');
            let sql = "UPDATE users set lastLogin = ? WHERE userID = ?";
            db.query(sql,[user.lastLogin,user.id], function (err, user) {});
            user._token = token;
            resolve(user);
          }
        } else {
          resolve(user.add_error("Wrong Password"));
        }
      });
    });
  }
  /**
   * Locate a user by email.
   * @param {string} email
   * @return {User}
   */
  static async find(email) {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM users WHERE userEmail = ?", email,
        (err, users, fields) => {
        if (err) {
          reject(err);
        } else if (users.length < 1) {
          resolve(null);
        } else {
          let names = fields.map(f => f.name);
          let u = new User(users[0].userID);
          for (let n of names) {
            u[n] = users[0][n];
          }
          resolve(u);
        }
      });
    });
  }
  /**
   * Load data from db for this user.
   */
  async load() {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM users WHERE userID = ?", this.id,
        (err, users, fields) => {
        if (err) {
          reject(err);
        } else if (users.length < 1) {
          resolve(null);
        } else {
          let names = fields.map(f => f.name);
          for (let n of names) {
            this[n] = users[0][n];
          }
          resolve(this);
        }
      });
    });
  }
  /**
   * Validate the email of a user.
   * @param {string} token
   * @return {User} - The user validated, or null for none found
   */
  static async validate_email(token) {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM users WHERE emailConfirmationToken = ?", token, function (err, user, fields) {
        if (user.length == 0) {
          resolve(null);
        } else {
          var userID = user[0].userID;
          var sql = 'UPDATE users set emailStatus = ? , '+
            'userStatus = ? , emailConfirmationToken = ?  WHERE userID = ?';
          db.query(sql,["Verified", "Active","", userID], function (err, user) {
            if (err) {
              console.error('#### Error in update user: ',err);
              return reject(err);
            }
            resolve(user);
          });
        }
      });
    });
  }
  /**
   * Change the password for the user.
   * @param {string} old_password
   * @param {string} new_password
   * @return {User}
   */
  async change_password(old_password, new_password) {

  }
  /**
   * Subscribe the user to the mailing list.
   * @return {boolean} - True for succesful subscription
   */
  async subscribe() {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM subscribers WHERE subscribeEmail = ?", this.userEmail,
        (err, suser) => {
        if (err) {
          console.error('#### Error in subscribing user', err);
          return reject(err);
        }
        if (suser.length==0) {
          let createdAt = new Date();
          let ins={
            subscribeEmail:this.userEmail,
            createdAt:createdAt,
          };
          db.query('INSERT INTO subscribers SET ?', ins, function (err, result) {
            if (err) {
              console.error('#### Error in subscribing user', err);
              return reject(err);
            }
            if (result.affectedRows==1) {
              resolve();
            } else {
              console.error('#### Failed to insert subscription for user ',this.userEmail, result);
              reject('Failed to subscribe user');
            }
          });
        }
      });
    });
  }
  /**
   * Add an error to the user object.
   * @param {string} error
   * @return {User} - The modified user object
   */
  add_error(msg) {
    if (this._errors) {
      this._errors.push(msg);
    } else {
      this._errors = [msg];
    }
    return this;
  }
  /**
   * Modify profile fields of user.
   */
  async save() {
    return new Promise((resolve, reject) => {
      db.query('UPDATE users SET userFirstName=?, userLastName=?, userEmail=?, avatar=?, bio=?, url=?, location=? WHERE userID = ?',
      [this.userFirstName, this.userLastName, this.userEmail, this.avatar, this.bio, this.url, this.location, this.id], (err, result) => {
        if (err) {
          console.error('#### Error in saving profile fields', err);
          reject(err);
        } else if (result.affectedRows != 1) {
          console.error('#### Failed to update user profile fields ',result);
          reject('Failed to save profile fields');
        } else {
          resolve(this);
        }
      })
    })
  }
}

module.exports = User;
