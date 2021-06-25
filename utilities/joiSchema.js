import Joi from 'joi';


const studySpotValidator = Joi.object({
    studySpot: Joi.object({
        description: Joi.string().required(),
        image: Joi.string().required(),
        library: Joi.string().required()
    }).required()
})

export { studySpotValidator as default }