import DS from 'ember-data';

const { Model, attr, hasMany } = DS;

export default Model.extend({

	///////////////////////////////////
	// Common props // Model for "query" or "findAll"
	///////////////////////////////////

	articleID:  			attr('number'), //articleID
	title: 					attr('string'), //articleTitle
	body: 					attr('string'), //articleDescription
	image:  				attr('string'), //articleImage
	dateStart: 				attr('date'), 	//articleStartDate
	tag: 					attr('string'), //articleTags
	firstName: 				attr('string'), //userFirstName
	lastName: 				attr('string'), //userLastName
	
	///////////////////////////////////
	// Model for "findRecord"
	///////////////////////////////////

	allowComment: 			attr('boolean'), //articleAllowComment
	allowGallery: 			attr('boolean'), //articleAllowGallery
	allowSubmission: 		attr('boolean'), //articleAllowSubmission
	allowVoting: 			attr('boolean'), //articleAllowUpvoting
	dateEndVoting: 			attr('date'), 	 //articleEndVotingDate
	dateExpire: 			attr('date'), 	 //articleExpireDate
	dateCreated: 			attr('date'), 	 //createdAt
	dateUpdated: 			attr('date'), 	 //updatedAt
	rules: 					attr('string'),  //articleRules
	status: 				attr('string'),  //articleStatus
	submissionType: 		attr('string'),  //articleSubmissionType
	userID: 				attr('number'),  //userID

	///////////////////////////////////
	// Relationship part of the "findRecord" call
	///////////////////////////////////

	submissions:			hasMany('submission'),

	///////////////////////////////////
	// Custom Added
	///////////////////////////////////

	url: 					attr('string'),
});
