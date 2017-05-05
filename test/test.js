const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const Favs = require('../models/fav-place')
const User = require('../models/user')
const server = require('../server')

chai.use(chaiHttp)

describe('USER TEST', ()=> {
let currentTest

  beforeEach((done)=> {
    new User({
      email: 'user1@mail.com',
      password: 'test'
    }).save((err, data)=> {
      if(err) {
        console.log(err)
      } else {
        currentTest = data
        done()
      }
    })
  })

  afterEach((done)=> {
    User.collection.remove({})
    currentTest = ''
    done()
  })

  it('Register should add 1 new user data into database', function(done) {
    chai.request(server)
      .post('/user/register')
      .send({
        email: 'user2@mail.com',
        password: 'test'
      })
      .end(function(err, res) {
        res.should.have.status(200)
        res.body.should.have.property('email')
        res.body.should.have.property('password')
        res.body.email.should.equal('user2@mail.com')
        User.find((err,users)=> {
          users.should.be.a('array')
          users.length.should.equal(2)
          done()
        })
      })
  })

  it('Correct password - User logged in and token should be created', (done)=> {
    chai.request(server)
      .post('/user/login')
      .send({
        email: currentTest.email,
        password: currentTest.password
      })
      .end((err,res)=> {
        res.should.have.status(200)
        res.body.should.be.a('string')
        done()
      })
  })

  it('Wrong password - should get status 401 and no token created', (done)=> {
    chai.request(server)
      .post('/user/login')
      .send({
        email: 'user1@mail.com',
        password: 'wrong'
      })
      .end((err,res)=> {
        res.should.have.status(401)
        done()
      })
  })

  it('Should get 1 user information', (done)=> {
    chai.request(server)
      .get('/user/'+currentTest._id)
      .end((err,res)=> {
        res.should.have.status(200)
        res.body.should.have.property('email')
        res.body.should.have.property('favouritePlaces')
        res.body.favouritePlaces.should.be.a('array')
        done()
      })
  })

  it('Should delete 1 user in database', (done)=> {
    chai.request(server)
      .delete('/user/'+currentTest._id)
      .end((err,res)=> {
        res.should.have.status(200)
        res.body.should.have.property('email')
        done()
      })
  })
})