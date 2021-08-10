import mongoose from 'mongoose';

const librarySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        requried: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    studySpots: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudySpot'
    }]
})

const Library = mongoose.model('Library', librarySchema)

export default Library;

