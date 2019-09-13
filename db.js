//db connections using mongoose

const mongoose = require('mongoose')
const {conxnURL, dbName} = require('./config/dbConfig')
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false);

mongoose.connect(`${conxnURL}/${dbName}`,{ useNewUrlParser: true }, (err,done)=>{
    if(err){
        console.log('db connection failed')
    }
    else{
        console.log('db connection success')
    }
})