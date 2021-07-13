import mongoose from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

// add authentication 
userSchema.plugin(passportLocalMongoose)  // adds username && password fields
const User = mongoose.model('User', userSchema)
export { User as default }