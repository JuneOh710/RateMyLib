import mongoose from 'mongoose';
import Library from '../models/library.js';
// import geocoding from '@mapbox/mapbox-sdk/services/geocoding.js';
// const mbxGeocoding = geocoding;
import { readFile } from 'fs/promises';

const libraryLocationMap = JSON.parse(
    await readFile(
        new URL('./libraryLocationMap.json', import.meta.url)
    )
);


// dotenv.config()
// console.log('===========================')
// const geocodingService = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

mongoose.connect('mongodb://localhost:27017/rateMyLib', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(console.log('Database connected ==> seed'))
    .catch(err => console.log('connection error:', err))

let index = 1;
const getRandomLibraryImage = () => {
    const imagePath = `libraryImages/${index}.jpg`
    index >= 19 ? index = 1 : index++;
    return imagePath
}


const libraryList = [];
for (let [name, location] of Object.entries(libraryLocationMap)) {
    libraryList.push({
        name: name,
        location: {
            "type": "Point",
            "coordinates": location
        },
        image: getRandomLibraryImage()
    })
}


const result = await Library.insertMany(libraryList)
console.log('=== all done ===\n', result)

