import mongoose from 'mongoose';
import express from 'express';
import path from 'path';
import Library from './models/library.js';
import StudySpot from './models/StudySpot.js';
import methodOverride from 'method-override';

// __direname is undefined when using es6 modules for some reason. 
const __dirname = path.resolve(path.dirname(decodeURI(new URL(import.meta.url).pathname)));

// connecting to mongoose
mongoose.connect('mongodb://localhost:27017/rateMyLib', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(console.log('Database connected'))
    .catch(err => console.log('connection error:', err))
const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))


// I don't know what I'm doing here.
// const options = { index: false, redirect: false }

app.use(express.static('seeds'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

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


// update study spot
app.get('/studySpots/:id/update', async (req, res) => {
    const { id } = req.params;
    const studySpot = await StudySpot.findById(id).populate('library', 'name')
    res.render(`studySpots/update.ejs`, { studySpot })
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


app.listen(4000, () => {
    console.log('Serving on port 4000')
})
