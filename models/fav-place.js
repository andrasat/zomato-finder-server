const mongoose = require('mongoose')
const Schema = mongoose.Schema

let favSchema = new Schema({
  userId: {type: Schema.Types.ObjectId, ref:'User'},
  name: String,
  url: String,
  location: {
    address: String,
    city: String,
    city_id: Number,
    country_id: Number
  },
  user_rating: {
    aggregate_rating: String,
    rating_text: String
  },
  average_cost_for_two: Number,
  currency: String,
  featured_image: String
})

let Fav  = mongoose.model('Fav', favSchema)
module.exports = Fav