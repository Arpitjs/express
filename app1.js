var express = require('express');
var morgan = require('morgan');
var path = require('path');
var app = express();
const config = require('./config')

require('./db')
let api = require("./controllers/apiRoute")()
app.use(morgan('dev'));
 
//inbuilt middleware
app.use('/file', express.static(path.join(__dirname, 'files'))); // server static file externally
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

let cors = require('cors')
app.use(cors())

 app.use('/api',api)

app.use((err, req, res, next) =>{
    console.log('i am error handling middleware', err);
    res.status(err.status || 400)
    res.json({
        message: err.msg || err,
        status: err.status || 400,
    });
});

app.listen(config.port, (err, done)=> {
    if (err) {
        console.log('error listening to port');
    }
    else {
        console.log('server listening at port ', config.port);
    }
});

