"use strict";

const PORT = 8000;
const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser  = require('body-parser');

const {
  MongoClient,
  ObjectID
} = require("mongodb");

app.use("/js", express.static("js"));
app.use("/css", express.static("css"));
app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

const credentials = fs.readFileSync("./cert.pem");

const client = new MongoClient(
  "mongodb+srv://wecycle-vancouver.2hson.mongodb.net/myFirstDatabase?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority", {
  sslKey: credentials,
  sslCert: credentials,
  useUnifiedTopology: true
}
);

client.connect().then(function () {
  console.log("check before the db run");
});


// EXPRESS METHODS

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/html/index.html");
});


// THIS POST CREATES A TABLE DATA WITH USE OF MONGODB

app.post("/create-table", function (req, res) {

  res.setHeader('Content-Type', 'application/json');

  console.log(req.body.name);

  // The values added stores into MongoDB collections
  function addToUsersCollection(
    nameValue = req.body.name,
    contactNumberValue = req.body.contactNumber,
    bottlesDonatedValue = req.body.bottlesDonated,
    bottlesTakenValue = req.body.bottlesTaken,
    addressValue = req.body.address,
  ) {
    client.db("WecycleMain").collection("Users").insertOne({
      name: nameValue,
      contactNumber: contactNumberValue,
      bottlesDonated: bottlesDonatedValue,
      bottlesTaken: bottlesTakenValue,
      address: addressValue,
    });
  }
  addToUsersCollection();

  res.send({ status: "success", msg: "Recorded updated." });

});

app.get('/', function (req, res) {
  let doc = fs.readFileSync('./index.html', "utf8");
  res.send(doc);
});


app.get("/read-table", function (req, res) {
  res.setHeader("Content-Type", "application/json");

  // where 'client' is a constant of the mongodb atlas url + SSL certificates


  async function grabData() {
    client.db("WecycleMain").collection("Users")
      .find()
      .toArray()
      .then((data) => {
        // console.log(data);
        res.json(data); //is this part wrong?
      })
      .catch((error) => console.error(error));
  };


  try {

    //The code below can be used to delete the entire database or generate some users for testing.

    // client.db("WecycleMain").collection("Users").deleteMany({
    //   bottlesDonated: 27
    // })
    // client.db("WecycleMain").collection("Users").insertMany([{
    //   name: "Mazin",
    //   contactNumber: "1234567891",
    //   bottlesDonated: 27,
    //   bottlesTaken: 127,
    //   address: "12 Ravine Dr."
    // }, {
    //   name: "MarwanSquared",
    //   contactNumber: "1234567891",
    //   bottlesDonated: 27,
    //   bottlesTaken: 127,
    //   address: "12 Ravine Dr."
    // }, {
    //   name: "Johnson",
    //   contactNumber: "1234567891",
    //   bottlesDonated: 27,
    //   bottlesTaken: 127,
    //   address: "12 Ravine Dr."
    // }, {
    //   name: "Jason",
    //   contactNumber: "1234567891",
    //   bottlesDonated: 27,
    //   bottlesTaken: 127,
    //   address: "12 Ravine Dr."
    // }, {
    //   name: "Raymond",
    //   contactNumber: "1234567891",
    //   bottlesDonated: 27,
    //   bottlesTaken: 127,
    //   address: "12 Ravine Dr."
    // }, {
    //   name: "Zainabe",
    //   contactNumber: "1234567891",
    //   bottlesDonated: 27,
    //   bottlesTaken: 127,
    //   address: "12 Ravine Dr."
    // }, ])
    grabData();
  } catch (err) {
    throw new Error("grab data didnt execute properly");
  }


});

//when updating, use number.parseInt()
app.post("/update-table/", function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  // console.log(req.body, req.body.data._id, req.body.id);
  // let keyName = Object.keys(req.body)[1];
  // console.log(keyName);
  async function update() {
    client.db("WecycleMain").collection("Users").updateOne(
      {_id: ObjectID(req.body.id)},
      {$set: req.body.data}).catch((error) => console.log(error));
  };
  update();

    res.send({ status: "success", msg: "Update worked" });    
});

app.post("/delete-row/:id", function (req, res) {
  //Find the id of the user from the parameters in the request. Use that id to find it and delete it
  let id = req.params.id;
  client.db("WecycleMain").collection("Users").findOneAndDelete({
    _id: ObjectID(id)
  });
  //Respond with the remaining users in the db as a json array.
  client.db("WecycleMain").collection("Users")
    .find()
    .toArray()
    .then((data) => {
      res.json(data); //is this part wrong?
    })
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});