const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema({
    name: String,
    address:{
        type: String
    },
    username:{
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true

    },
    email: {
        type: String,
        unique: true,
        sparse: true
    },
    phoneNumber:{
        type: Number
    },
    dob: Date,
    gender:{
        type: String,
        enum: ['male', 'female', 'others']
    },
    role:{
        type: Number, //admin,normal users
        default: 2
    },
status:{
    type: Boolean,
    default: true
},passwordResetExpiry: Date,
passwordResetToken: String
},{
    timestamps: true
}, {
    limit: Number
})


const userModel = mongoose.model('user', userSchema)
module.exports = userModel