const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const conxnURL = 'mongodb://localhost:27017'
const dbName = 'arpit'

module.exports = {
    mongodb, MongoClient, conxnURL, dbName
}