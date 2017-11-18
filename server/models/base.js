
/**
 * Base class for models.
 */
class Base {
  /**
   * Create user objects by prividing the user id.
   * @param {int} id - The id of the user
   * @return {User}
   */
  constructor(id) {
    this._id = id;
    this._errors = null;
  }
  /**
   * Return the id of the user.
   * @return {int} - The database id for the user
   */
  get id() {
    return this._id;
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
   * Return the user in serializable form (all internal fields removed).
   */
  get serialized() {
    let o = {};
    for (let k of Object.keys(this)) {
      if (!k.startsWith('_')) {
        o[k] = this[k];
      }
    }
    return o;
  }

  /**
   * Set property values
   * @param {hash} hash - values to set
   */
  set(hash) {
    for (let k of Object.keys(hash)) {
      if (!k.startsWith('_')) {
        this[k] = hash[k];
      }
    }
    return this;
  }
}

module.exports = Base;
