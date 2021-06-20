import mongoose from 'mongoose';


const studySpotSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    library: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Library'
    }
})

const StudySpot = mongoose.model('StudySpot', studySpotSchema);

export default StudySpot;