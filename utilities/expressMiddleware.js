import studySpotValidator from './joiSchema.js'
import AppError from './AppError.js'
import StudySpot from '../models/studySpot.js';
import Rating from '../models/rating.js';

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

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.previousUrl = req.originalUrl || '/';
        req.flash('error', 'you must be logged in')
        return res.redirect('/login')
    }
    next()
}

const isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const post = await StudySpot.findById(id)
    if (req.user.username !== post.username) {
        req.flash('error', "access denied")
        return res.redirect(`/studySpots/${post._id}`)
    }
    return next()
}

const isRatingAuthor = async (req, res, next) => {
    const { ratingId, spotId } = req.params;
    const rating = await Rating.findById(ratingId)
    if (req.user.username !== rating.user) {
        req.flash('error', 'access denied')
        return res.redirect(`/studySpots/${spotId}`)
    }
    return next()
}

export { validateStudySpot, validateRating, isLoggedIn, isAuthor, isRatingAuthor }