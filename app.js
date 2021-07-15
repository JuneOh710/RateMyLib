import mongoose from 'mongoose'
import express from 'express'
import path from 'path'
import methodOverride from 'method-override'
import engine from 'ejs-mate'
import studySpotRouter from './routers/studySpotRoutes.js'
import libraryRouter from './routers/libraryRoutes.js'
import authRouter from './routers/authRoutes.js'
import AppError from './utilities/AppError.js'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import flash from 'connect-flash'
import passport from 'passport'
import localStrategy from 'passport-local'
import User from './models/user.js'


// __dirname is undefined when using es6 modules for some reason. 
// so define __dirname as below
const __dirname = path.resolve(path.dirname(decodeURI(new URL(import.meta.url).pathname)));
// ms * s * min * hour * day * week
const oneWeek = 1000 * 60 * 60 * 24 * 7
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
// session middleware
app.use(session({
    secret: 'hehe',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + oneWeek,
        maxAge: oneWeek
    }
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
// setup cookie-parser
app.use(cookieParser('mySecret'))
// setup flash 
app.use(flash())
// flash & locals middleware
app.use((req, res, next) => {
    // make res.locals.X available as X in files rendering in this request cycle. 
    res.locals.currentUser = req.user  // included in req body by passport.js 
    res.locals.success = req.flash('success')  // undefined unless created new spot
    res.locals.error = req.flash('error')
    next()
})

// home route
app.get('/', (req, res) => {
    res.render('home.ejs')
})

// library routes
app.use('/libraries', libraryRouter)

// study spot routes
app.use('/studySpots', studySpotRouter)

// auth-related routes
app.use('/', authRouter)

// any other routes that does not exist
app.all('*', (req, res, next) => {
    next(new AppError('this page does not exist', 404))
})

// error handler
app.use((err, req, res, next) => {
    if (!err.status) {
        res.status = 500;
        err.status = 500;
    } else {
        res.status = err.status
    }
    if (!err.message) { err.message = 'something went wrong!' }
    res.render('error.ejs', { err })
})

const PORT = 4000;

app.listen(PORT, () => {
    console.log(`Serving on port ${PORT}`)
})
