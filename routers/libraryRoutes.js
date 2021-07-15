import express from 'express';
const libraryRouter = express.Router()
import Library from '../models/library.js'
import { asyncHandle } from '../utilities/helpers.js'

// get libraries index page
libraryRouter.get('/', asyncHandle(async (req, res) => {
    const libraries = await Library.find({})
    res.render('libraries/index.ejs', { libraries })
}))
// get library details
libraryRouter.get('/:libId', asyncHandle(async (req, res) => {
    const { libId } = req.params;
    const library = await Library.findById(libId).populate('studySpots')
    res.render('libraries/show.ejs', { library })
}))

export { libraryRouter as default }