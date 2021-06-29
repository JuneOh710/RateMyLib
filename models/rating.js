import mongoose from 'mongoose'

const ratingSchema = new mongoose.Schema({
    score: {
        type: Number,
        required: true
    },
    user: {
        type: String
    }
})

const Rating = mongoose.model('Rating', ratingSchema)

export { Rating as default }