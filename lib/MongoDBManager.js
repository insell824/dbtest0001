const Mongo = require('mongodb')
const MongoClient = Mongo.MongoClient
var mClient
var mClientCnnected
let connectionString = process.env.MONGO_DB || ''

function MongoDBManager() {
  this.ObjectID = Mongo.ObjectID
  this.DB_NAME = process.env.DBName || "DB"
  this.init = function (){
    mClientCnnected = false
    mClient = new MongoClient(connectionString, { 
      useNewUrlParser: (process.env.MONGO_DB_NEW_PARSER=='TRUE'),
      useUnifiedTopology: true // https://github.com/mongodb/node-mongodb-native/releases/tag/v3.2.1
    })
    
    var event = require('events').EventEmitter
    this.em = new event()

    new Promise((resolve, reject) => {
      console.log('Mongo DB connecting...')
      mClient.connect(err => {
        if (err) return reject(err)
        resolve()
      })
    }).then(() => {
      mClientCnnected = true
      console.log('Mongo DB connected.')
      this.em.emit('connected', mClient)
    }).catch((reason) => {
      mClient = null
      console.error("Mongo DB ERROR:")
      console.log(reason.message)
    })
  }

  this.addEventListener = function (event, listener) {
    this.em.on(event, listener)
  }
  this.getClient = function () {
    return mClient
  }
  this.isConnected = function(){
    return mClientCnnected
  }

  this.getClientAsync = async function () {
      for(var i=0; i<8; i++){
        if(mClientCnnected){
          return mClient
        }
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
      return null
  }

  this.close = function(){
    if (mClient) {
      console.log('Closing Mongo DB Connection...')
      // systemMsg('Closing Mongo DB Connection...')
      mClient.close()
      console.log('Closed Mongo DB Connection.')
      // systemMsg("Closed Mongo DB Connection.")
    }
  }
}

var mongoDBManager = new MongoDBManager()
module.exports = mongoDBManager
