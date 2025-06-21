const Joi = require('joi');

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required(),
    category: Joi.string().required(),
    image: Joi.object({
        url: Joi.string().allow('', null),
        filename: Joi.string().allow('', null)
    }).optional()
}).required()
});


// for reviews server side validation (code number: 26)
module.exports.reviewSchema  = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5), // rating must be between 1 and 5
        comment: Joi.string().required(),
        
    }).required(),
});

