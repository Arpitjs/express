//authenticate= chinne, knowing the user
//authorize = having rights to do something
let jwt = require('jsonwebtoken')
let config = require('./../config')
const userModel = require('./../models/userModel')
module.exports = function (req, res, next) {
    //console.log('request headers>', req.headers)
    let token
    if (req.headers['x-access-token']) {
        token = req.headers['x-access-token'];
    }
    else if (req.headers['authorization']) {
        token = req.headers['authorization'];
    }
    else if (req.headers['token']) {
        token = req.headers['token']
    }
    else if (req.query.token) {
        token = req.query.token
    }
    if (!token) {
        return next({
            msg: "token not provided"
        })
    }


    jwt.verify(token, config.jwtSecret,(err, decoded)=> {
        if (err) {
            return next(err)
        }
        console.log('decoded value',decoded)
        //decoded value isnt always identical to db values
        //if user is remove from system still token will work so we have to check in db using middleware
        userModel.findOne({_id: decoded.id})
        .exec((err,user)=>{
           if(err){
               return next(err)
           } 
           if(user){
              req.user = user 
              return next()
               }
           else{
               next({
                   msg: 'user removed from system'
               })
           }
        })
    })
}