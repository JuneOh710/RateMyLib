import mongoose from 'mongoose';


const studySpotSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    image: {
        imageName: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String,
            required: true
        }
    },
    library: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Library'
    },
    ratings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rating'
    }],
    username: {
        type: String,
        required: true
    }
})

const StudySpot = mongoose.model('StudySpot', studySpotSchema);

export default StudySpot;