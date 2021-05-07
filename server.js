"use strict";

const PORT = 8000;
const express = require("express");
const app = express();
const fs = require("fs");
const {
  MongoClient, ObjectID
} = require("mongodb");
// const http = require("http");

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

client.connect();

console.log("check before the db run");

// EXPRESS METHODS

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/html/index.html");
});

app.post("/create", function (req, res) {
  res.send({
    status: "success",
    rows,
    results
  });
});

app.get("/read-table", function (req, res) {
  res.setHeader("Content-Type", "application/json");

  // where 'client' is a constant of the mongodb atlas url + SSL certificates

  async function grabData() {
    await client.connect();
    client.db("WecycleMain").collection("Users")
      .find()
      .toArray()
      .then((data) => {
        console.log(data);
        res.json(data); //is this part wrong?
      })
      .catch((error) => console.error(error));
  };

  grabData();

  // client.close(); // closing the client will break the program. Why?


});

app.post("/update-table", function (req, res) {
  res.send({
    status: "success",
    rows,
    results
  });
});

app.delete("/delete-row", function (req, res) {
  let rowId = req.params.id;
  console.log(id);
  client.db("WecycleMain").collection("Users").findOneAndDelete({ _id: rowId});
  
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});