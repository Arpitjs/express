var router = require('express').Router();
const userModel = require('./../models/userModel')
const map_user = require('./../helpers/map_user_req')
const authorize = require('./../middlewares/authorize')
router.route('/')

.get((req,res,next)=>{
    console.log('request user>>',req.user)
    console.log('req.query >>', req.query);
    var condition = {};
    var page = Number(req.query.page) - 1 
    var pageCount = Number(req.query.pageCount) 
    var skipValue = page * pageCount;

    // console.log('skip value >>', skipValue);
    // console.log('page Count', pageCount);
    userModel.find(condition)
        .sort({ _id: -1 })
        .skip(skipValue)
        .limit(pageCount)
    
        .exec((err, users)=> {
            if (err) {
                return next(err);
            }
            res.status(200).json(users);
        })
}) 
router.route('/:id')
.get((req,res,next)=>{
    console.log('request user>>',req.user)   
    userModel.findById(req.params.id, (err,user)=>{
        if(err){
            return next(err)
        }
        res.status(200).json(user)
    })
})
.delete(authorize, (req,res,next)=>{
    console.log('request user>>',req.user)
    userModel.findById(req.params.id,(err,user)=>{
        if(err){
            return next(err)
        }
        if(user){
            user.remove((err,user)=>{
                if(err){
                    return next(err)
                }
                res.status(200).json(user)
            })
        }else{
            next({
                msg: 'user aint found'
            })
        }
    })
})
.put((req,res,next)=>{
    console.log('request user>>',req.user)
    let id = req.params.id
    //findByIdAndUpdate also can be done
    userModel.findById(id)
    .exec((err,user)=>{
        if(err){
            return next(err)
        }
        if(!user){
            return next({
                msg: 'user aint found'
            })
        }
        //this user is a object which is instance of user model
        let updatedUser = map_user(user, req.body)
        updatedUser.updatedBy = req.user.name
        updatedUser.save((err,done)=>{
            if(err){
                return next(err)
            }
            res.status(200).json(done)
        })
    })

})
module.exports = router