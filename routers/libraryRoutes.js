import express from 'express';
const libraryRouter = express.Router()
import { asyncHandle } from '../utilities/helpers.js'
import * as controller from '../controllers/libraryController.js'

// get libraries index page
libraryRouter.get('/', asyncHandle(controller.index))
// get library details
libraryRouter.get('/:libId', asyncHandle(controller.viewLibrary))

export { libraryRouter as default }