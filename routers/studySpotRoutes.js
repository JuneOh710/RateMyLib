import express from 'express'
import { validateStudySpot, completeRequestBody, validateRating, isLoggedIn, isAuthor, isRatingAuthor, isFirstRating } from '../utilities/expressMiddleware.js'
import { asyncHandle } from '../utilities/helpers.js'
import *  as controller from '../controllers/studySpotController.js'
import multer from 'multer'
import { uploadImage } from '../utilities/firebaseSetup.js'

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // keep images size < 5 MB
    },
})

const studySpotRouter = express.Router()
// get all study spots 
studySpotRouter.get('/', asyncHandle(controller.index))

// add new study spot
studySpotRouter.get('/new', isLoggedIn, asyncHandle(controller.getCreateForm))
studySpotRouter.post('/', isLoggedIn, upload.single('image'), uploadImage, completeRequestBody,
    validateStudySpot, asyncHandle(controller.createStudySpot))


// edit study spot
studySpotRouter.get('/:id/edit', isLoggedIn, isAuthor, asyncHandle(controller.getEditForm))
studySpotRouter.put('/:id', isLoggedIn, isAuthor,
    completeRequestBody, validateStudySpot, asyncHandle(controller.editStudySpot))

// get details of study spot
studySpotRouter.get('/:id', isLoggedIn, asyncHandle(controller.viewStudySpot))

// delete study spot
studySpotRouter.delete('/:id', isLoggedIn, isAuthor, asyncHandle(controller.deleteStudySpot))


// rating routes
// add rating to studySpot
studySpotRouter.patch('/:id/rate', isLoggedIn, validateRating, isFirstRating,
    asyncHandle(controller.addRating))

// delete rating from studySpot
studySpotRouter.delete('/:spotId/rate/:ratingId', isLoggedIn, isRatingAuthor,
    asyncHandle(controller.deleteRating))

// edit rating from studySpot
studySpotRouter.patch('/:spotId/rate/:ratingId', isLoggedIn, isRatingAuthor,
    asyncHandle(controller.editRating))

export { studySpotRouter as default }