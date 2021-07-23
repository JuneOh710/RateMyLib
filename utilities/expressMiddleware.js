import studySpotValidator from './joiSchema.js'
import AppError from './AppError.js'
import StudySpot from '../models/studySpot.js';
import Rating from '../models/rating.js';

// include req.file into req.body.studySpot
// or add existing image to req.body.studySpot
const completeRequestBody = async (req, res, next) => {
    if (req.file) {
        req.body.studySpot.image = { imageName: req.file.uniqueName, imageUrl: req.file.publicUrl }
    } else {
        const { id } = req.params;
        const studySpot = await StudySpot.findById(id)
        const image = Object.create(null)
        image.imageName = studySpot.image.imageName;
        image.imageUrl = studySpot.image.imageUrl;
        req.body.studySpot.image = image;
    }
    next()
}

// server-side validation middleware
const validateStudySpot = (req, res, next) => {
    console.log(req.body.studySpot)
    const validationError = studySpotValidator.validate(req.body).error;
    if (validationError) {
        const message = validationError.details[0].message;
        return next(new AppError(message, 404))
    }
    next()
}

const validateRating = (req, res, next) => {
    const { id } = req.params;
    if (!req.body.studySpot) {
        return next(new AppError('there must be a rating', 404))
    }
    const { rating: ratingString } = req.body.studySpot;
    const rating = Number(ratingString)
    if (rating < 1 || rating > 5) {
        req.flash('error', 'cannot submit empty rating')
        return res.redirect(`/studySpots/${id}`)

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

const isFirstRating = async (req, res, next) => {
    const { id } = req.params;
    const studySpot = await StudySpot.findById(id).populate('ratings', 'user')
    const ratedBefore = studySpot.ratings.some(element => element.user === req.user.username)
    // add the rating to the studySpot's ratings
    if (ratedBefore) {
        req.flash('error', 'access denied')
        return res.redirect(`/studySpots/${id}`)
    }
    return next()
}

export { validateStudySpot, completeRequestBody, validateRating, isLoggedIn, isAuthor, isRatingAuthor, isFirstRating }