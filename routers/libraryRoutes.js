import express from 'express';
const libraryRouter = express.Router()
import Library from '../models/library.js'

// get libraries index page
libraryRouter.get('/', async (req, res) => {
    const libraries = await Library.find({}).catch(err => next(err))
    res.render('libraries/index.ejs', { libraries })
})
// get library details
libraryRouter.get('/:libId', async (req, res) => {
    const { libId } = req.params;
    const library = await Library.findById(libId).populate('studySpots').catch(err => next(err))
    res.render('libraries/show.ejs', { library })
})

export { libraryRouter as default }