const router = require('express').Router()


var authRoute = require('./auth.route');
var userRoute = require('./user.route');
var itemRouter = require('./../components/items/item.route')
//middlewares
const authenticate = require('./../middlewares/authenticate')
const authorize = require('./../middlewares/authorize')
module.exports = function () {
    router.use('/auth', authRoute)
    router.use('/user', authenticate, userRoute)
    router.use('/item', authenticate, itemRouter)
    return router
}