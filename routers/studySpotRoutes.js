import express from 'express';
import validateStudySpot from '../expressMiddleware.js'
import StudySpot from '../models/studySpot.js';
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
    const studySpot = await StudySpot.findByIdAndUpdate(id, { description, library, image }).catch(err => next(err))
    res.redirect(`/studySpots/${id}`)
})

// get details of study spot
studySpotRouter.get('/:id', async (req, res) => {
    const { id } = req.params;
    const studySpot = await StudySpot.findById(id).populate('library', 'name').catch(err => next(err))
    res.render('studySpots/show.ejs', { studySpot })
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

export { studySpotRouter as default }