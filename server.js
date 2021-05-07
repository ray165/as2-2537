"use strict";

const PORT = 8000;
const express = require("express");
const app = express();
const fs = require("fs");
const {
  MongoClient,
  ObjectID
} = require("mongodb");

app.use("/js", express.static("js"));
app.use("/css", express.static("css"));

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

app.post("/create-table", function (req, res) {
  res.send({ status: "success", rows, results });

});

app.get('/', function (req, res) {
  let doc = fs.readFileSync('./index.html', "utf8");
  res.send(doc);
})


app.get("/read-table", function (req, res) {
  res.setHeader("Content-Type", "application/json");

  // where 'client' is a constant of the mongodb atlas url + SSL certificates


  async function grabData() {
    client.db("WecycleMain").collection("Users")
      .find()
      .toArray()
      .then((data) => {
        console.log(data);
        res.json(data); //is this part wrong?
      })
      .catch((error) => console.error(error));
  };


  try {
    // client.db("WecycleMain").collection("Users").deleteMany({
    //   name: "Zainabe"
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

app.post("/update-table", function (req, res) {
  res.send({
    status: "success",
    rows,
    results
  });
});

app.post("/delete-row/:id", function (req, res) {
  let id = req.params.id;
  client.db("WecycleMain").collection("Users").findOneAndDelete({
    _id: ObjectID(id)
  });
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