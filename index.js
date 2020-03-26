require('dotenv').config()
const processLife =  require('insell-node-process-life-manager')
const mongoDBManager = require('./lib/MongoDBManager')
const CollectionName = 'Test'

mongoDBManager.init()
processLife.addEndListener(function () {
  return new Promise(function (resolve, reject) {
    mongoDBManager.close()
    resolve()
  })
})

;(async ()=>{
  try{
    let mClient = await mongoDBManager.getClientAsync()
    let rows =  await mClient.db(mongoDBManager.DB_NAME).collection(CollectionName).find().toArray()
    console.log(rows)
  }catch(e){
    console.error(e)
  }
})()