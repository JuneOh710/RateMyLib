import express from 'express'
import User from '../models/user.js'
import AppError from '../utilities/AppError.js'

const authRouter = express.Router()

authRouter.get('/register', (req, res) => {
    res.render('users/register')
})

authRouter.post('/register', async (req, res, next) => {
    const { username, email, password } = req.body.user;
    const newUser = new User({ username, email })
    try {
        const registeredUser = await User.register(newUser, password)
        req.flash('success', 'you are now registered!')
        res.redirect('/libraries')
    }
    catch (err) {
        req.flash('error', err.message)
        res.redirect('/register')
    }
})
export { authRouter as default }
