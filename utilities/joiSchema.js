import Joi from 'joi';

const studySpotValidator = Joi.object({
    studySpot: Joi.object({
        description: Joi.string().required(),
        image: Joi.object({
            imageName: Joi.string().required(),
            imageUrl: Joi.string().required()
        }).required(),
        library: Joi.string().required(),
        username: Joi.string().required()
        // rating: Joi.number().integer().min(1).max(5).required()
    }).required()
})

export { studySpotValidator as default }