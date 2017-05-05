const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema

let userSchema = new Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  favouritePlaces: [{type: Schema.Types.ObjectId, ref:'Fav'}]
})

let User  = mongoose.model('User', userSchema)
module.exports = User

userSchema.path('email').validate((value)=> {
  let emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return emailReg.test(value)
}, `Please input the correct email format`)

userSchema.plugin(uniqueValidator)