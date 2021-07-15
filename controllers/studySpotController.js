import StudySpot from "../models/studySpot.js"
import Library from "../models/library.js"
import Rating from "../models/rating.js"

export const index = async (req, res, next) => {
    const studySpots = await StudySpot.find({}).populate('library', 'name')
    res.render('studySpots/index.ejs', { studySpots })
}

export const getCreateForm = async (req, res, next) => {
    const libraries = await Library.find({})
    res.render('studySpots/new.ejs', { libraries })
}

export const createStudySpot = async (req, res, next) => {
    const { description, library: libraryName, image, username } = req.body.studySpot;
    const library = await Library.findOne({ name: libraryName })
    const studySpot = new StudySpot({ description, library, image, username })
    library.studySpots.push(studySpot)
    await library.save()
    await studySpot.save()
    req.flash('success', 'study spot saved!')
    res.redirect(`/studySpots/${studySpot._id}`)
}

export const getEditForm = async (req, res, next) => {
    const { id } = req.params;
    const studySpot = await StudySpot.findById(id).populate('library', 'name')
    const libraries = await Library.find({})
    res.render(`studySpots/edit.ejs`, { studySpot, libraries })
}

export const editStudySpot = async (req, res, next) => {
    const { id } = req.params;
    const { description, library: libraryName, image, username } = req.body.studySpot;
    const library = await Library.findOne({ name: libraryName })
    await StudySpot.findByIdAndUpdate(id, { description, library, image, username })
    res.redirect(`/studySpots/${id}`)
}

export const viewStudySpot = async (req, res, next) => {
    const { id } = req.params;
    const studySpot = await StudySpot.findById(id).populate('library', 'name').populate('ratings')
    let totalRating = 0;
    studySpot.ratings.forEach(item => { totalRating += item.score })
    const averageRating = (totalRating / studySpot.ratings.length).toFixed(1)
    res.render('studySpots/show.ejs', { studySpot, averageRating })
}

export const deleteStudySpot = async (req, res, next) => {
    const { id } = req.params;
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
}

export const addRating = async (req, res, next) => {
    const { rating: score } = req.body.studySpot;
    const { id } = req.params;
    const rating = new Rating({ score, user: req.user.username })
    const studySpot = await StudySpot.findById(id).populate('ratings', 'user')
    // add the rating to the studySpot's ratings
    studySpot.ratings.push(rating)
    await studySpot.save()
    await rating.save()
    res.redirect(`/studySpots/${id}`)
}

export const deleteRating = async (req, res, next) => {
    const { spotId, ratingId } = req.params;
    await Rating.findByIdAndDelete(ratingId)
    const studySpot = await StudySpot.findById(spotId)
    studySpot.ratings = studySpot.ratings.filter(rating => rating !== ratingId)
    await studySpot.save()
    res.redirect(`/studySpots/${spotId}`)
}

export const editRating = async (req, res, next) => {
    const { spotId, ratingId } = req.params;
    const { rating: newScore } = req.body.studySpot;
    await Rating.findByIdAndUpdate(ratingId, { score: newScore })
    res.redirect(`/studySpots/${spotId}`)
}
