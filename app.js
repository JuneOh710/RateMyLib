import mongoose from 'mongoose'
import express from 'express'
import path from 'path'
import methodOverride from 'method-override'
import engine from 'ejs-mate'
import studySpotRouter from './routers/studySpotRoutes.js'
import libraryRouter from './routers/libraryRoutes.js'
import AppError from './utilities/AppError.js'

// __dirname is undefined when using es6 modules for some reason. 
// so define __dirname as below
const __dirname = path.resolve(path.dirname(decodeURI(new URL(import.meta.url).pathname)));

// connecting to mongoose
mongoose.connect('mongodb://localhost:27017/rateMyLib', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false  // added these options as suggested by docs and warnings.
})
    .then(console.log('Database connected'))
    .catch(err => console.log('connection error:', err))
const app = express();

app.engine('ejs', engine);  // use layout system 
app.set('view engine', 'ejs');  // read ejs files
app.set('views', path.join(__dirname, 'views'))  // set absolute file path to views


app.use(express.static('seeds'));
app.use(express.urlencoded({ extended: true }));  // to parse req.body from req from html form 
app.use(methodOverride('_method'));  // to make put and delete requests from html form

// home route
app.get('/', (req, res) => {
    res.render('home.ejs')
})

// library routes
app.use('/libraries', libraryRouter)

// study spot routes
app.use('/studySpots', studySpotRouter)

// any other routes that does not exist
app.all('*', (req, res, next) => {
    next(new AppError('this page does not exist', 404))
})

// error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500)
    if (!err.message) { err.message = 'something went wrong!' }
    res.render('error.ejs', { err })
})

app.listen(4000, () => {
    console.log('Serving on port 4000')
})
