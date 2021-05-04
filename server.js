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




const credentials = fs.readFileSync('./cert.pem');

const client = new MongoClient('mongodb+srv://wecycle-vancouver.2hson.mongodb.net/myFirstDatabase?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority', {
  sslKey: credentials,
  sslCert: credentials
});

async function run() {
  try {
    await client.connect();
    const database = client.db("testDB");
    const collection = database.collection("testCol");
    const docCount = await collection.countDocuments({});
    console.log(docCount);
    // perform actions using client
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

console.log("check b4 db run");
// run().catch(console.dir);

// EXPRESS METHODS 

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/html/index.html');
});

app.get('/tableHTML', function (req, res){
    res.setHeader('Content-Type', 'text/html');
    dataList = myData.getHTML();
    res.send(dataList);
});

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});



































