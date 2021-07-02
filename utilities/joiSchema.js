import Joi from 'joi';

const studySpotValidator = Joi.object({
    studySpot: Joi.object({
        description: Joi.string().required(),
        image: Joi.string().required(),
        library: Joi.string().required()
        // rating: Joi.number().integer().min(1).max(5).required()
    }).required()
})

export { studySpotValidator as default }