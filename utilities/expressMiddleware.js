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

const validateRating = (req, res, next) => {
    if (!req.body.studySpot) {
        return next(new AppError('there must be a rating', 404))
    }
    const { rating } = req.body.studySpot;
    if (rating < 1 || rating > 5) {
        return next(new AppError('rating must be in between 1 and 5', 404))
    }
    return next()
}
export { validateStudySpot, validateRating }