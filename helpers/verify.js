const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = {
  decode(token) {
    try {
      let decoded = jwt.verify(token, process.env.SECRET)
      return decoded
    } catch(err) {
      console.log(err)
    }
  }
}