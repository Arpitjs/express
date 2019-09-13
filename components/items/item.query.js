const ItemModel = require('./itemsModel');
function map_item_req(item, itemDetails) {
    if (itemDetails.name) {
        item.name = itemDetails.name
    }
    if (itemDetails.category) {
        item.category = itemDetails.category
    }
    if (itemDetails.brand) {
        item.brand = itemDetails.brand
    }
    if (itemDetails.description) {
        item.description = itemDetails.description
    }
    if (itemDetails.price) {
        item.price = itemDetails.price
    }
    if (itemDetails.color) {
        item.color = itemDetails.color
    }
    if (itemDetails.tags) {
        item.tags = typeof (itemDetails.tags) === 'string'
            ? itemDetails.tags.split(',')
            : itemDetails.tags;
    }
    if (itemDetails.image) {
        item.image = itemDetails.image
    }
    if (itemDetails.quantity) {
        item.quantity = itemDetails.quantity
    }
    if (itemDetails.modelNo) {
        item.modelNo = itemDetails.modelNo
    }
    if (itemDetails.status) {
        item.status = itemDetails.status
    }
    if (itemDetails.user) {
        item.user = itemDetails.user
    }
    if (itemDetails.discount == 'true' && itemDetails.discountType && itemDetails.discountValue) {
        item.discount = {
            status: itemDetails.discount,
            discountType: itemDetails.discountType,
            discountValue: itemDetails.discountValue
        } //object expected 
    }
    if (itemDetails.ratingPoint && itemDetails.ratingMsg) {
        let ratings = {
            point: itemDetails.ratingPoint,
            message: itemDetails.ratingMsg,
            user: itemDetails.user
        }
        item.reviews.push(ratings);
    }
    return item;
}
function insert(reqData) {

    return new Promise(function (resolve, reject) {
        let newItem = new ItemModel({});
        var mappedItem = map_item_req(newItem, reqData);
        mappedItem.save(function (err, done) {
            if (err) {
                reject(err);
            } else {
        
                resolve(done);
            }
        });
    });

}

function fetch(condition) {
       return ItemModel.find(condition)
            .populate('user', {
                password: 0
            })
            .sort({
                _id: -1
            })
            .exec(); 
}

/**
 * 
 * @param {string} id 
 * @param {object} updatedData 
 * @returns promise
 */
function update(id, updatedData) {
    return new Promise(function (resolve, reject) {
        ItemModel.findById(id)
            .exec(function (err, item) {
                if (err) {
                    reject(err);
                }
                if (item) {
                    var oldImage = item.image;
                    var updatedItem = map_item_req(item, updatedData);

                    updatedItem.save(function (err, data) {
                        if (err) {
                            return reject(err);
                        }
                        resolve({ data, oldImage });
                    });
                } else {
                    reject({
                        msg: 'Item not foundu'
                    });
                }
            });
    })

}

function remove(id) {
    return new Promise(function (resolve, reject) {
        ItemModel.findByIdAndRemove(id)
            .exec(function (err, removed) {
                if (err) {
                    return reject(err);
                }
                resolve(removed);
            })
    })
}

module.exports = {
    insert, fetch, update, remove, map_item_req
};
