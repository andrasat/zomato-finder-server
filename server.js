const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const passport = require('passport')
const port = process.env.PORT || 3000
require('dotenv').config()

const app = express()

// App config

let DBconfig = {
  development: 'mongodb://localhost/zomatofinder',
  production: 'mongodb://andras:'+process.env.ATLAS_PW+'@zomatofinder-shard-00-00-j1amx.mongodb.net:27017,zomatofinder-shard-00-01-j1amx.mongodb.net:27017,zomatofinder-shard-00-02-j1amx.mongodb.net:27017/zomatofinder?ssl=true&replicaSet=zomatofinder-shard-0&authSource=admin',
  test: 'mongodb://localhost/zomatofinder-test'
}

mongoose.Promise = global.Promise
mongoose.connect(DBconfig[app.settings.env])
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', ()=> {
  console.log('Mongoose connection established in '+ app.settings.env)
})
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(passport.initialize())

// App routes
const user = require('./routes/user')
const fav = require('./routes/fav-place')

app.use('/user', user)
app.use('/fav', fav)

// Server listen
let server = app.listen(port)
console.log(`Listening to ${port}`)

module.exports = server