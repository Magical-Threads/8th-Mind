let db = require('../db');

/**
 * Class for managing users in the system.
 */
class User {
  /**
   * Create user objects by prividing the user id.
   * @param {int} id - The id of the user
   * @return {User}
   */
  constructor(id) {
    this._id = id;
    this._errors = null;
    this._token = null;
  }
  /**
   * Return the id of the user.
   * @return {int} - The database id for the user
   */
  get id() {
    return this._id;
  }

  /**
   * Return the session token for the user (only available after a login operation)
   * @return {string} - the session token
   */
  get token() {
    return this._token;
  }
  /**
   * Return any errors associated with the user object.  Errors result from methods
   * that can return a user, but may not be able to do so given the inputs provided.
   * In these cases a User with errors is returned.
   * @return {string[]} - errors
   */
  get errors() {
    return this._errors;
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
            user = user._token = token;
            let sql = "UPDATE users set lastLogin=? WHERE userID = ?";
            db.query(sql,[lastLogin,userID], function (err, user) {});
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
          resolve(new User().setData(users[0], fields));
        }
      });
    })
  }
  /**
   * Load summary data for the user into the user object.
   * If summary data is already loaded this does nothing.
   */
  async loadSummary() {

  }
  /**
   * Load detail data for the user into the user object.
   * If detail data is loaded already this does nothing.
   */
  async loadDetails() {

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
  }
}

module.exports = User;
