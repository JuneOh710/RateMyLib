import express from 'express'
import { validateStudySpot, validateRating } from '../utilities/expressMiddleware.js'
import StudySpot from '../models/studySpot.js'
import Library from '../models/library.js'
import Rating from '../models/rating.js'
const studySpotRouter = express.Router()


// get all study spots 
studySpotRouter.get('/', async (req, res) => {
    const studySpots = await StudySpot.find({}).populate('library', 'name').catch(err => next(err))
    res.render('studySpots/index.ejs', { studySpots })
})


// add new study spot
studySpotRouter.get('/new', (req, res) => {
    res.render('studySpots/new.ejs')
})
studySpotRouter.post('/', validateStudySpot, async (req, res, next) => {
    const { description, library: libraryName, image } = req.body.studySpot;
    const library = await Library.findOne({ name: libraryName }).catch(err => next(err))
    const studySpot = new StudySpot({ description, library, image })
    library.studySpots.push(studySpot)
    await library.save().catch(err => next(err))
    await studySpot.save().catch(err => next(err))
    res.redirect(`/studySpots/${studySpot._id}`)
})


// edit study spot
studySpotRouter.get('/:id/edit', async (req, res) => {
    const { id } = req.params;
    const studySpot = await StudySpot.findById(id).populate('library', 'name').catch(err => next(err))
    res.render(`studySpots/edit.ejs`, { studySpot })
})
studySpotRouter.put('/:id', validateStudySpot, async (req, res) => {
    const { id } = req.params;
    const { description, library: libraryName, image } = req.body.studySpot;
    const library = await Library.findOne({ name: libraryName }).catch(err => next(err))
    await StudySpot.findByIdAndUpdate(id, { description, library, image }).catch(err => next(err))
    res.redirect(`/studySpots/${id}`)
})


// get details of study spot
studySpotRouter.get('/:id', async (req, res) => {
    const { id } = req.params;
    const studySpot = await StudySpot.findById(id).populate('library', 'name').populate('ratings', 'score')
        .catch(err => next(err))
    let totalRating = 0;
    studySpot.ratings.forEach(item => { totalRating += item.score })
    const averageRating = (totalRating / studySpot.ratings.length).toFixed(1)
    res.render('studySpots/show.ejs', { studySpot, averageRating })
})


// delete study spot
studySpotRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const studySpot = await StudySpot.findByIdAndDelete(id).catch(err => next(err))
    const library = await Library.findById(studySpot.library).catch(err => next(err))
    // delete the studySpot id in the libary document 
    library.studySpots = library.studySpots.filter(s => s._id !== id)
    await library.save().catch(err => next(err))
    res.redirect(`/libraries/${library._id}`)
})




// rating routes
// add rating to studySpot
studySpotRouter.patch('/:id/rate', validateRating, async (req, res, next) => {
    const { rating: score } = req.body.studySpot;
    const { id } = req.params;
    const rating = new Rating({ score, user: 'placeHolder' })
    const studySpot = await StudySpot.findById(id).catch(err => next(err))
    // add the rating to the studySpot's ratings
    studySpot.ratings.push(rating)
    await studySpot.save().catch(err => next(err))
    await rating.save().catch(err => next(err))
    res.redirect(`/studySpots/${id}`)
})

// delete rating from studySpot
studySpotRouter.delete('/:spotId/rate/:ratingId', async (req, res, next) => {
    const { spotId, ratingId } = req.params;
    await Rating.findByIdAndDelete(ratingId)
        .catch(err => next(err))
    const studySpot = await StudySpot.findById(spotId)
        .catch(err => next(err))
    studySpot.ratings = studySpot.ratings.filter(rating => rating !== ratingId)
    await studySpot.save()
        .catch(err => next(err))
    res.redirect(`/studySpots/${spotId}`)
})


// edit rating from studySpot
studySpotRouter.patch('/:spotId/rate/:ratingId', async (req, res, next) => {
    const { spotId, ratingId } = req.params;
    const { rating: newScore } = req.body.studySpot;
    await Rating.findByIdAndUpdate(ratingId, { score: newScore })
        .catch(err => next(err))
    res.redirect(`/studySpots/${spotId}`)
})



export { studySpotRouter as default }