var router = require('express').Router();
router.route('/task')
    .get( (req, res, next) => {
        res.end('from nested user>> proile >> task')
    })
    .post( (req, res, next) => {

    })
    .put((req, res, next) => {

    })
    .delete( (req, res, next)=>  {

    });

module.exports = router;
