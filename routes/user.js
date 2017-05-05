const express = require('express')
const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const UserModel = require('../models/user')
const router = express.Router()
const User = require('../controllers/user')

passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
  },
  (username, password, done)=> {
    UserModel.findOne({email: username}, (err,user)=> {
      if(err) {
        done(err)
      } else if(!user) {
        done(null, false)
      } else {
        bcrypt.compare(password, user.password, (err,res)=> {
          if(err) {
            done(err)
          } else if(!res) {
            done(null, false)
          } else {
            done(null, user)
          }
        })
      }
    })
  }
))

// User Router
router.get('/', User.getUsers)
router.get('/:id', User.getOneUser)
router.post('/register', User.register)
router.post('/login', passport.authenticate('local', {session: false}), User.login)
router.delete('/:id', User.deleteUser)

module.exports = router