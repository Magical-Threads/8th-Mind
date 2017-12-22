import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  normalizeFindRecordResponse: function(store, primaryModelClass, payload, id, requestType) {
    // console.log('@@@@ Payload on find user: ',payload,' id: ',id);
    if (payload.success) {
      let user = payload.data;
      // console.log('@@@@ using as payload: ',user);
      return this._super(store, primaryModelClass, {user: {
        firstName: user.userFirstName,
        lastName: user.userLastName,
        email: user.userEmail,
        id: id,
        userID: id,
        url: user.url,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location
      }}, id, requestType);
    } else {
			throw new DS.AdapterError();
    }
  },
  normalizeSaveResponse(store, primaryModelClass, payload, id, requestType) {
    let user = payload.user;
    // console.log('@@@@ using as payload: ',user);
    return this._super(store, primaryModelClass, {user: {
      firstName: user.userFirstName,
      lastName: user.userLastName,
      email: user.userEmail,
      id: id,
      userID: id,
      url: user.url,
      avatar: user.avatar,
      bio: user.bio,
      location: user.location
    }}, id, requestType);
  },
  serialize(snapshot, options) {
    var json = {
      id: snapshot.id
    };
    snapshot.eachAttribute((key, attribute) => {
      let ser = {
        firstName: 'userFirstName',
        lastName: 'userLastName',
        email: 'userEmail'
      }[key] || key
      json[ser] = snapshot.attr(key);
    });
    snapshot.eachRelationship((key, relationship) => {
      if (relationship.kind === 'belongsTo') {
        json[key] = snapshot.belongsTo(key, { id: true });
      } else if (relationship.kind === 'hasMany') {
        json[key] = snapshot.hasMany(key, { ids: true });
      }
    });

    return json;
  },
});
