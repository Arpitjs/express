var express = require('express');
var router = express.Router();
var passwordHash = require("password-hash");
const UserModel = require('./../models/userModel')
const map_user = require('./../helpers/map_user_req');
const authCtrl = require('./auth.controller');
const sender = require('./../config/nodemailerConfig')
function createMail(data) { //data object should contain link, name and email
    let mailBody = {
        from: 'Locker App <noreply@lockerapp.com>'+ data.email, // sender address
        to: 'arpited7@gmail.com', // list of receivers
        subject: 'Forgot Password ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: `<p>Hi <b>${data.name}</b>,</p>
        <p>We noticed that you are having trouble logging into our system,please click the link below to reset your password</p>
        <p><a href="${data.link}">click here to reset password</a></p> 
        <p>Ignore this email if you have not requested to change your password</p>
        <p>Regards,</p>
        <p>Locker App</p>`//html body

    }
    return mailBody;
   
}
router.post('/login', authCtrl.login);
router.get('/check-username/:username', (req, res, next) => {
    UserModel.findOne({
        username: req.params.username
    })
        .then((data) => {
            if (data) {
                res.status(200).json(data);
            } else {
                next({
                    msg: 'user not found'
                })
            }

        })
        .catch((err) => {
            next(err);
        })
})

router.post('/register', (req, res, next) => {
    console.log('req.data >>', req.body);

    let newUser = new UserModel({});
    const mappedUser = map_user(newUser, req.body);

    console.log('new user >>>', newUser);
    // newUser.save( (err,=> done) {
    //     if (err) {
    //         return next(err);
    //     }
    //     res.status(200).json(done);
    // })
    mappedUser.password = passwordHash.generate(req.body.password)
    mappedUser.save()
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            next(err);
        });

})

router.post('/forgot-password', (req, res, next) => {
    console.log('req headers' + req.headers)
    UserModel.findOne({
        email: req.body.email
    })
        .exec((err, user) => {
            if (err) {
                return next(err)
            } if (user) {
                //email processing
                let resetToken = require('randomstring').generate(20)
                console.log('user found' + user)
                let emailContent = {}
                emailContent.name = user.username
                emailContent.email = req.body.email
                emailContent.link = `${req.headers.origin}/auth/reset/${resetToken}`

                let passwordResetExpiryTime = Date.now() + 1000 * 60 * 60 * 5
                let mailBody = createMail(emailContent)
                user.passwordResetExpiry = passwordResetExpiryTime
                user.passwordResetToken = resetToken
                user.save((err, saved) => {
                    if (err) {
                        return next(err)
                    }
                    sender.sendMail(mailBody, (err, done) => {
                        if (err) {
                            return next(err)
                        }
                        res.json(done)
                    })
                })

            } else {
                next({
                    msg: 'user not found with provided email address'
                })
            }
        })
})

router.post('/reset-password/:token', (req, res, next) => {
    let token = req.params.token
    UserModel.findOne({
        passwordResetToken: token,
        // passwordResetExpiry: {
        //     $gte: Date.now()
        // }
    })
        .exec((err, user) => {
            if (err) {
                return next(err)
            }
            if (user) {
                //reset time 2 pm, cureent 1 pm
                if (new Date(user.passwordResetExpiry).getTime() < Date.now()) {
                    //allow for reset
                    return next({
                        msg: 'reset token expired'
                    })
                }
                user.password = passwordHash.generate(req.body.password)
                //once password is reset erase the token and expiry time
                user.passwordResetToken = null
                user.passwordResetExpiry = null
                user.save((err, saved) => {
                    if (err) {
                        return next(err)
                    }
                    res.json(saved)
                })
            }
            else {
                next({
                    msg: 'invalid or expired token!'
                })
            }
        })
})
module.exports = router;

