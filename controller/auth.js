const {validationResult} = require('express-validator')
const User = require('../model/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


exports.signup = (req, res, next) => {
const errors = validationResult(req)
if(!errors.isEmpty()){
const error = new Error('Validation Failed')
error.statusCode = 402
error.data = errors.array()
throw error
}
const email = req.body.email
const password = req.body.password
const name = req.body.name
bcrypt.hash(password, 12)
.then(hashedPw => {
const user = new User({
    email: email,
    password: hashedPw,
    name: name
})
return user.save()
}).then(result => {
    res.status(201)
    .json({message: 'User Created', 
    userId: result._id})
}).catch(err => {
if(!err.statusCode){
    err.statusCode = 500
    }
    next(err)

})

}




exports.login = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  let loadedUser
  User.findOne({email:email}) 
  .then(user => {
      if(!user){
        const error = new Error('Email does not exist, Please signup')
        error.statusCode = 402
        throw error
      }
      const loadedUser = user
      return bcrypt.compare(password, user.password)
  }).then(isEqual => {
      if(!isEqual){
        const error = new Error('Password is Incorrect')
        error.statusCode = 402
        throw error
      }
      const token = jwt
      .sign({email: email, 
        userId: loadedUser._id
        .toString()}, 
        'secretsceret', 
        {expiresIn: '1hr'})
      res.status(200)
      .json({message: 'Logged In', 
      token: token, 
      userId: loadedUser._id.toString()})
  }).catch(err => {
    if(!err.statusCode){
        err.statusCode = 500
        }
        next(err) 
  })
    

}