import mongoose from 'mongoose';
import express from 'express';
import path from 'path';
import Library from './models/library.js';
import StudySpot from './models/StudySpot.js';
import methodOverride from 'method-override';
import engine from 'ejs-mate';

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
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))  // set absolute file path to views


app.use(express.static('seeds'));
app.use(express.urlencoded({ extended: true }));  // to parse req.body from html form
app.use(methodOverride('_method'));  // to make put and delete requests from html form

// library routes
// get home page
app.get('/', (req, res) => {
    res.render('home.ejs')
})


// get libraries index page
app.get('/libraries', async (req, res) => {
    const libraries = await Library.find({})
    res.render('libraries/index.ejs', { libraries })
})
// get library details
app.get('/libraries/:libId', async (req, res) => {
    const { libId } = req.params;
    const library = await Library.findById(libId).populate('studySpots');
    res.render('libraries/show.ejs', { library })
})



// study spot routes
// get all study spots 
app.get('/studySpots', async (req, res) => {
    const studySpots = await StudySpot.find({}).populate('library', 'name')
    res.render('studySpots/index.ejs', { studySpots })
})

// add new study spot
app.get('/studySpots/new', (req, res) => {
    res.render('studySpots/new.ejs')
})
app.post('/studySpots', async (req, res) => {
    const { description, library: libraryName, image } = req.body.studySpot;
    const library = await Library.findOne({ name: libraryName })
    const studySpot = new StudySpot({ description, library, image })
    library.studySpots.push(studySpot)
    await library.save()
    await studySpot.save()
    res.redirect(`/studySpots/${studySpot._id}`)
})


// edit study spot
app.get('/studySpots/:id/edit', async (req, res) => {
    const { id } = req.params;
    const studySpot = await StudySpot.findById(id).populate('library', 'name')
    res.render(`studySpots/edit.ejs`, { studySpot })
})
app.put('/studySpots/:id', async (req, res) => {
    const { id } = req.params;
    const { description, library: libraryName, image } = req.body.studySpot;
    const library = await Library.findOne({ name: libraryName })
    const studySpot = await StudySpot.findByIdAndUpdate(id, { description, library, image })
    res.redirect(`/studySpots/${id}`)
})

// get details of study spot
app.get('/studySpots/:id', async (req, res) => {
    const { id } = req.params;
    const studySpot = await StudySpot.findById(id).populate('library', 'name')
    res.render('studySpots/show.ejs', { studySpot })
})

// delete study spot
app.delete('/studySpots/:id', async (req, res) => {
    const { id } = req.params;
    const studySpot = await StudySpot.findByIdAndDelete(id)
    const library = await Library.findById(studySpot.library)
    // delete the studySpot id in the libary document 
    library.studySpots = library.studySpots.filter(s => s._id !== id)
    await library.save()
    res.redirect(`/libraries/${library._id}`)
})


app.listen(4000, () => {
    console.log('Serving on port 4000')
})
