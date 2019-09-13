const UserModel = require('./../models/userModel')
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
const config = require('./../config');

function login(req, res, next) {
    console.log('form request here at login >>>', req.body);
    UserModel.findOne({ username: req.body.username })
        .exec(function (err, user) {
            if (err) {
                return next(err);
            }
            if (user) {
                var isMatched = passwordHash.verify(req.body.password, user.password);
                if (isMatched) {
                    var token = jwt.sign({ id: user._id, name: user.username, role: user.role }, config.jwtSecret);
                    res.json({
                        user,
                        token
                    });
                } else {
                    console.log('password didnot matched');
                    next({
                        msg: 'invalid password credentials'
                    })
                }

            } else {
                next({
                    msg: "invalid username credentials"
                })
            }
        })
}


module.exports = {
    login
}
