const ItemQuery = require('./item.query');
const fs = require('fs');
// __dirname == working directory path
// process.cwd() root directory path
const path = require('path');
function insert(req, res, next) {
    console.log('req.body>>>', req.body);
    console.log('req.file>>>', req.file);
    if (req.fileError) {
        return next({
            msg: 'invalid file format from filter'
        })
    }
    if (req.file) {
        var mimeType = req.file.mimetype.split('/')[0];
        if (mimeType != 'image') {
            fs.unlink(path.join(process.cwd(), 'uploads/images/' + req.file.filename), function (err, done) {
                if (err) {
                    console.log('err ');
                } else {
                    console.log('removed');
                }
            })
            return next({
                msg: "invalid file format"
            });
        }
    }
    var data = req.body;
    data.user = req.user._id;
    if (req.file) {
        data.image = req.file.filename;
    }
    ItemQuery.insert(data)
        .then(function (data) {
            res.json(data);
        })
        .catch(function (err) {
            next(err);
        });


}

function find(req, res, next) {
    let condition = {};
    if (req.user.role != 1) {
        condition.user = req.user._id;
    }
    ItemQuery.fetch(condition)
        .then(function (data) {
            res.json(data);
        })
        .catch(function (err) {
            next(err);
        })

}

function findById(req, res, next) {
    ItemQuery.fetch({ _id: req.params.id })
        .then(function (data) {
            res.json(data[0]);
        })
        .catch(function (err) {
            next(err);
        })
}

function update(req, res, next) {
    console.log('req.file >>>', req.file);
    console.log('req.body ,>>', req.body);
    req.body.user = req.user._id;
    if (req.file) {
        req.body.image = req.file.filename;
    }
    ItemQuery.update(req.params.id, req.body)
        .then(function (response) {
            if (req.file) {
                fs.unlink(path.join(process.cwd(), 'uploads/images/' + response.oldImage), function (err, done) {
                    if (err) {
                        console.log('err');
                    } else {
                        console.log('removed');
                    }
                });
            }
            res.json(response.data);
        })
        .catch(function (err) {
            next(err);
        })
}

function remove(req, res, next) {
    ItemQuery.remove(req.params.id)
        .then(function (data) {
            res.json(data);
        })
        .catch(function (err) {
            next(err);
        })
}
function searchByPost(req, res, next) {
    console.log('req body' + req.body)
    let condition = {}
    condition.user = req.user._id
    let searchCondition = ItemQuery.map_item_req(condition, req.body)
    console.log('search condiition', searchCondition)
    if (req.body.minPrice) {
        searchCondition.price = {
            $gte: req.body.minPrice //greater than equal to
        }
    }
    if (req.body.maxPrice) {
        searchCondition.price = {
            $lte: req.body.maxPrice
        }
    }
    if (req.body.minPrice && req.body.maxPrice) {
        searchCondition.price = {
            $lte: req.body.maxPrice,
            $gte: req.body.minPrice
        }
    }
    if (req.body.tags) {
        searchCondition.tags = {
            $in: req.body.tags.split(',')
        }
    }

    ItemQuery.fetch(searchCondition)
        .then((data) => {
            res.json(data)
        })
        .catch((err) => {
            next(err)
        })
}

function searchByGet(req, res, next) {
    let condition = {}
    condition.user = req.user._id
    let searchCondition = ItemQuery.map_item_req(condition, req.query)
    console.log('search condiition', searchCondition)
    ItemQuery.fetch(searchCondition)
        .then((data) => {
            res.json(data)
        })
        .catch((err) => {
            next(err)
        })
}


module.exports = {
    insert, find, findById, update, remove, searchByGet, searchByPost
}
