const Fav = require('../models/fav-place')
const User = require('../models/user')
const Help = require('../helpers/verify')

module.exports = {

  addFav(req,res) {
    let decoded = Help.decode(req.headers.token)
    new Fav({
      userId: decoded.id,
      name: req.body.name,
      url: req.body.url,
      location: {
        address: req.body.address,
        city: req.body.city,
        city_id: req.body.city_id,
        country_id: req.body.country_id
      },
      user_rating: {
        aggregate_rating: req.body.aggregate_rating,
        rating_text: req.body.rating_text
      },
      average_cost_for_two: req.body.average_cost_for_two,
      currency: req.body.currency,
      featured_image: req.body.featured_image
    }).save((err, fav)=> {
      if(err) {
        console.log(err)
        res.status(400).send(err)
      } else {
        User.update({_id: decoded.id}, {$push: {favouritePlaces: fav._id}}, {new: true, safe: true, upsert: true})
          .exec((error, result)=> {
            if(error) {
              console.log(error)
              res.status(400).send(error)
            } else {
              res.send(result)
            }
          })
      }
    })
  },
  deleteFav(req,res) {
    let decoded = Help.decode(req.headers.token)
    Fav.findByIdAndRemove(req.params.id, (err, fav)=> {
      if(err) {
        console.log(err)
        res.status(400).send(err)
      } else {
        User.update({_id: decoded.id}, {$pullAll: [{favouritePlaces: fav._id}]}, {safe: true})
          .exec((error, result)=> {
            if(error) {
              console.log(error)
              res.status(400).send(error)
            } else {
              res.send(result)
            }
          })
      }
    })
  },
  getFavs(req,res) {
    Fav.find()
      .populate('userId')
      .exec((err,favs)=> {
        if(err) {
          console.log(err)
          res.status(400).send(err)
        } else {
          res.send(favs)
        }
      })
  }
}