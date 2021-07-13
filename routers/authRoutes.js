import express from 'express'
import User from '../models/user.js'
import passport from 'passport'

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

authRouter.get('/login', (req, res) => {
    res.render('users/login')
})

authRouter.post('/login',
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
    (req, res) => {
        req.flash('success', 'you are logged in!')
        res.redirect('/libraries')
    })

authRouter.get('/logout', (req, res) => {
    req.logout()
    req.flash('success', 'logged out')
    res.redirect('/')
})
export { authRouter as default }
