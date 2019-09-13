//schema about how our system will be
let mongoose = require('mongoose')
let Schema = mongoose.Schema
let ratingSchema = new Schema({
    point: Number,
    message: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
    },{
       timestamps: true 
})
let ItemSchema = new Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    category: {
        type: String,
      required: true
    },
    description:{
        type: String,
    },
    brand: String,
    
    modelNo: String,
    color: {
        type: String
    },
    price: Number,
    discount: {
        status: Boolean,
        discountType: {
            type: String,
            enum: ['percentage', 'value', 'qty']
        },
        discountValue: String
    },
    status:{
        type: String,
        enum: ['out of stock', 'available', 'sold']
    },
    quantity: Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    reviews: [ratingSchema],
    tags: [String],
    image: String
},{
    timestamps: true
})

const ItemModel = mongoose.model('item', ItemSchema) //makes collection in the database

module.exports = ItemModel