const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Help = require('../helpers/verify');
require('dotenv').config()
let saltRounds = 10

module.exports = {

  register(req,res) {
    bcrypt.hash(req.body.password, saltRounds, (err, hash)=> {
      if(err) console.log(err)

      new User({
        email: req.body.email,
        password: hash
      }).save((err,user)=> {
        if(err) {
          console.log(err)
          res.status(400).send(err)
        } else {
          res.send(user)
        }
      })
    })
  },
  login(req,res) {
    let token = jwt.sign({id: req.user._id, email: req.user.email}, process.env.SECRET)
    res.send({'token': token, 'id': req.user._id})
  },
  getUsers(req,res) {
    User.find()
      .populate('favouritePlaces')
      .exec((err, users)=> {
        if(err) {
          res.status(400).send(err)
        } else {
          res.send(users)
        }
      })
  },
  getOneUser(req,res) {
    User.findById(req.params.id)
      .populate('favouritePlaces')
      .exec((err,user)=> {
        if(err) {
          res.status(400).send(err)
        } else {
          res.send(user)
        }
      })
  },
  deleteUser(req,res) {
    User.findByIdAndRemove(req.params.id, (err,user)=> {
      if(err) {
        console.log(err)
        res.status(400).send(err)
      } else {
        res.send(user)
      }
    })
  }
}