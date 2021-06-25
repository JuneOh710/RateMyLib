import studySpotValidator from './joiSchema.js'
import AppError from './AppError.js';


// server-side validation middleware
const validateStudySpot = (req, res, next) => {
    const validationError = studySpotValidator.validate(req.body).error;
    if (validationError) {
        const message = validationError.details[0].message;
        return next(new AppError(message, 400))
    }
    next()
}

export { validateStudySpot as default }