import express from 'express'
import { validateStudySpot, validateRating, isLoggedIn, isAuthor, isRatingAuthor } from '../utilities/expressMiddleware.js'
import StudySpot from '../models/studySpot.js'
import Library from '../models/library.js'
import Rating from '../models/rating.js'
import { asyncHandle } from '../utilities/helpers.js'
const studySpotRouter = express.Router()


// get all study spots 
studySpotRouter.get('/', asyncHandle(async (req, res, next) => {
    const studySpots = await StudySpot.find({}).populate('library', 'name')
    res.render('studySpots/index.ejs', { studySpots })
}))


// add new study spot
studySpotRouter.get('/new', isLoggedIn, asyncHandle(async (req, res, next) => {
    const libraries = await Library.find({})
    res.render('studySpots/new.ejs', { libraries })
}))

studySpotRouter.post('/', isLoggedIn, validateStudySpot, asyncHandle(async (req, res, next) => {
    const { description, library: libraryName, image, username } = req.body.studySpot;
    const library = await Library.findOne({ name: libraryName })
    const studySpot = new StudySpot({ description, library, image, username })
    library.studySpots.push(studySpot)
    await library.save()
    await studySpot.save()
    req.flash('success', 'study spot saved!')
    res.redirect(`/studySpots/${studySpot._id}`)
}))


// edit study spot
studySpotRouter.get('/:id/edit', isLoggedIn, asyncHandle(async (req, res, next) => {
    const { id } = req.params;
    const studySpot = await StudySpot.findById(id)
    studySpot.populate('library', 'name')
    res.render(`studySpots/edit.ejs`, { studySpot })

}))

studySpotRouter.put('/:id', isLoggedIn, isAuthor, validateStudySpot, asyncHandle(async (req, res, next) => {
    const { id } = req.params;
    const { description, library: libraryName, image, username } = req.body.studySpot;
    const library = await Library.findOne({ name: libraryName })
    await StudySpot.findByIdAndUpdate(id, { description, library, image, username })
    res.redirect(`/studySpots/${id}`)

}))


// get details of study spot
studySpotRouter.get('/:id', isLoggedIn, asyncHandle(async (req, res, next) => {
    const { id } = req.params;
    const studySpot = await StudySpot.findById(id).populate('library', 'name').populate('ratings', 'score')
    let totalRating = 0;
    studySpot.ratings.forEach(item => { totalRating += item.score })
    const averageRating = (totalRating / studySpot.ratings.length).toFixed(1)
    res.render('studySpots/show.ejs', { studySpot, averageRating })
}))


// delete study spot
studySpotRouter.delete('/:id', isLoggedIn, isAuthor, asyncHandle(async (req, res, next) => {
    const studySpot = await StudySpot.findByIdAndDelete(id)
    const library = await Library.findById(studySpot.library)
    // delete the studySpot id in the libary document 
    library.studySpots = library.studySpots.filter(s => s._id !== id)
    // delete all ratings associated to the studySpot
    for (let rating of studySpot.ratings) {
        await Rating.findByIdAndDelete(rating)
    }
    await library.save()
    res.redirect(`/libraries/${library._id}`)

}))


// rating routes
// add rating to studySpot
studySpotRouter.patch('/:id/rate', isLoggedIn, validateRating, asyncHandle(async (req, res, next) => {
    const { rating: score } = req.body.studySpot;
    const { id } = req.params;
    const rating = new Rating({ score, user: 'placeHolder' })
    const studySpot = await StudySpot.findById(id)
    // add the rating to the studySpot's ratings
    studySpot.ratings.push(rating)
    await studySpot.save()
    await rating.save()
    res.redirect(`/studySpots/${id}`)
}))

// delete rating from studySpot
studySpotRouter.delete('/:spotId/rate/:ratingId', isLoggedIn, isRatingAuthor, asyncHandle(async (req, res, next) => {
    const { spotId, ratingId } = req.params;
    await Rating.findByIdAndDelete(ratingId)
    const studySpot = await StudySpot.findById(spotId)
    studySpot.ratings = studySpot.ratings.filter(rating => rating !== ratingId)
    await studySpot.save()

    res.redirect(`/studySpots/${spotId}`)
}))


// edit rating from studySpot
studySpotRouter.patch('/:spotId/rate/:ratingId', isLoggedIn, isRatingAuthor, asyncHandle(async (req, res, next) => {
    const { spotId, ratingId } = req.params;
    const { rating: newScore } = req.body.studySpot;
    await Rating.findByIdAndUpdate(ratingId, { score: newScore })
    res.redirect(`/studySpots/${spotId}`)
}))



export { studySpotRouter as default }