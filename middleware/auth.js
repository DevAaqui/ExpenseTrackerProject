const jwt = require('jsonwebtoken')
const User = require('../model/userModel')

const authenticate = (req, res, next) => {

    const token = req.header('Authorization')
    //console.log(token)
    const user = jwt.verify(token , 'dvElG2diDtMN4DQoyEMcCQ7HaAGEuEM4') //By generate token for id we get object with id 
    console.log('userId>>>>>' , user.userId)

    User.findByPk(user.userId)
    .then(user =>{

        
        req.user = user
        next()
    })
    .catch(err => console.log(err))

}

module.exports = {
    authenticate
}