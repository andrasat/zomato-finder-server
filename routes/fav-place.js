const express = require('express')
const router = express.Router()
const Fav = require('../controllers/fav-place')

// Fav Place Router
router.get('/', Fav.getFavs)
router.post('/', Fav.addFav)
router.delete('/:id', Fav.deleteFav)

module.exports = router