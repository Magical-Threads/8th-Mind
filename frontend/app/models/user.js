import DS from 'ember-data';

export default DS.Model.extend({
    userID: 		DS.attr('number'),
    firstName: 	DS.attr('string'),
    lastName: 	DS.attr('string'),
    email:  		DS.attr('string'),
    url:        DS.attr('string'),
    bio:        DS.attr('string'),
    avatar:     DS.attr('string'),
    location:   DS.attr('string')
});
