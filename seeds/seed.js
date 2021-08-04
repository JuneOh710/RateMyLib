import mongoose from 'mongoose';
import Library from '../models/library.js';
import dotenv from 'dotenv'
import geocoding from '@mapbox/mapbox-sdk/services/geocoding.js';
const mbxGeocoding = geocoding;
import { readFile } from 'fs/promises';

const libraryLocationMap = JSON.parse(
    await readFile(
        new URL('./data.json', import.meta.url)
    )
);



// dotenv.config()
// console.log('===========================')
// console.log(mbxGeocoding)
// console.log(process.env.MAPBOX_TOKEN)
// console.log(process.env.GCLOUD_BUCKET)
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
const minLongitude = -79.347015 - 0.5
const minLatitude = 43.651070 - 0.5
const maxLongitude = -79.347015 + 0.5
const maxLatitude = 43.651070 + 0.5

// geocoding with proximity
// geocodingService.forwardGeocode({
//     query: 'Astronomy & Astrophysics Library',
//     bbox: [minLongitude, minLatitude, maxLongitude, maxLatitude]
// })
//     .send()
//     .then(response => {
//         const match = response.body;
//         console.log(match)
//     });

const libraryList = [];
for (let [name, location] of Object.entries(libraryLocationMap)) {
    libraryList.push({
        name: name,
        location: location,
        image: getRandomLibraryImage()
    })
}


const result = await Library.insertMany(libraryList)
console.log('=== all done ===\n', result)

