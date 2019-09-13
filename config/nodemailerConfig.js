const nodemailer = require('nodemailer')
const sender = nodemailer.createTransport({
    service: 'Gmail',
    auth:{
        user: 'broadwaytest44@gmail.com',
        pass: 'Broadwaytest44!'
    }
   
})

module.exports = sender