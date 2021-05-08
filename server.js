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
  res.send({
    status: "success",
    rows,
    results
  });

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
    grabData();
  } catch (err) {
    throw new Error("grab data didnt execute properly");
  }


});

//when updating, use number.parseInt()
app.post("/update-table/:id", function (req, res) {
  let id = req.params.id;
  let name = data.name;
  let address = data.address;
  let contactNumber = data.contactNumber;
  let bottlesTaken = Number(data.bottlesTaken);
  let bottlesDonated = Number(data.bottlesDonated);
  console.log("these are the attributes");
  console.log(id);
  console.log(name);
  console.log(address);
  console.log(contactNumber);
  console.log(bottlesTaken);
  console.log(bottlesDonated);
  let data = { $set: {
    name: name,
    address: address,
    contactNumber: contactNumber,
    bottlesTaken: bottlesTaken,
    bottlesDonated: bottlesDonated
  },}
  client.db("WecycleMain").collection("Users").updateOne({
    _id: ObjectID(id)
  }, data);
});


app.delete("/delete-row/:id", function (req, res) {

});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});