module.exports = function (req, res, next) {
    if (req.user.role == 1) {
        return next();

    } else {
        next({
            msg: 'you dont have accesss'
        })
    }
}
