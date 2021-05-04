'use strict'

const PORT = 8000;
const express = require('express');
const app = express();
const fs = require('fs');
const mysql = require('mysql'); // not using this
const bodyParser = require('body-parser'); // is inside express or something
const { MongoClient } = require('mongodb');
const http = require('http');

app.use('/js', express.static('/js'));
app.use('/css', express.static('/css'));

const credentials = fs.readFileSync('./cert.pem');

const client = new MongoClient('mongodb+srv://wecycle-vancouver.2hson.mongodb.net/myFirstDatabase?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority', {
  sslKey: credentials,
  sslCert: credentials
});

// const database = client.db("WecycleMain");
// const collection = database.collection("Users");

async function run() {
  try {
    await client.connect();
    // --> 
    const database = client.db("WecycleMain");
    const collection = database.collection("Users");
    const docCount = await collection.countDocuments({});
    console.log(docCount, "running");
    let testGet = await collection.find({}).toArray();
    console.log(testGet);

    // collection.insertOne({
    //   name : "Johnson Lau",
    //   contactNumber : "236-777-5240",
    //   bottlesDonated : 50,
    //   bottlesTaken : 4,
    //   address : "700 Ioco Road, Port Moody BC"
    // });

    // collection.insertMany([{
      
    // }])

    removeFromDB({name : "Johnson Lau"});
    addToUsersCollection("Raymond Wong", "778-876-5432", 0, 120, "Heritage Mountain");
    updateCollection("name", "Raymond Wong", "address", "123 Las Vegas Rd, LA");
    console.log(testGet);

    // perform actions using client
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

function removeFromDB(object) {
  const database = client.db("WecycleMain");
  const collection = database.collection("Users");
  collection.deleteOne(object);
}

function addToUsersCollection(nameValue, contactNumberValue, bottlesDonatedValue, bottlesTakenValue, addressValue) {
  const database = client.db("WecycleMain");
  const collection = database.collection("Users");
  collection.addOne({
    name : nameValue,
    contactNumber : contactNumberValue,
    bottlesDonated : bottlesDonatedValue,
    bottlesTaken : bottlesTakenValue,
    address : addressValue
  });
}

function updateCollection(searchKey, searchValue, key, newValue) {
  const database = client.db("WecycleMain");
  const collection = database.collection("Users");
  collection.updateOne({
    searchKey : searchValue
  }, {
    $set: { key : value}
  });
}

console.log("check before the db run");
run().catch(console.dir);

// EXPRESS METHODS 

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/html/index.html');
});

app.post('/create', function (req, res){

});

app.get('/read-table', function (req, res){
  try {
    await client.connect();
    const database = client.db("WecycleMain");
    const collection = database.collection("Users");
    let results = await collection.find({}).toArray();
    res.send({status: "success", rows: results});
  } catch (err){
    res.send({status: err});
  }

});

app.post('/update-table', function (req, res){

});

app.post('/delete-row', function (req, res){

});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



































