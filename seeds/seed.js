import mongoose from 'mongoose';
import Library from '../models/library.js';
import dotenv from 'dotenv'
dotenv.config()

import { readFile } from 'fs/promises';

const libraryLocationMap = JSON.parse(
    await readFile(
        new URL('./libraryLocationMap.json', import.meta.url)
    )
);

const atlasUrl = process.env.ATLAS_URL;

mongoose.connect(atlasUrl, {
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

