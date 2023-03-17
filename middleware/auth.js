const jwt = require('jsonwebtoken')
const User = require('../model/userModel')

const authenticate = (req, res, next) => {

    const token = req.header('Authorization')
    //console.log(token)
    const user = jwt.verify(token , 'dvElG2diDtMN4DQoyEMcCQ7HaAGEuEM4') //By generate token for id we get object with id 
    console.log('userId>>>>>' , user.userId)
    console.log('_id>>>>>' , user)

    User.findOne({'_id': user.userId})
    .then(user =>{
        
        
        req.user = user
        console.log('req.user', req.user)
        next()
    })
    .catch(err => console.log(err))

}

module.exports = {
    authenticate
}