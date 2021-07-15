import Library from '../models/library.js'

export const index = async (req, res) => {
    const libraries = await Library.find({})
    res.render('libraries/index.ejs', { libraries })
}

export const viewLibrary = async (req, res) => {
    const { libId } = req.params;
    const library = await Library.findById(libId).populate('studySpots')
    res.render('libraries/show.ejs', { library })
}
