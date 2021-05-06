"use strict";

const PORT = 8000;
const express = require("express");
const app = express();
const fs = require("fs");
const { MongoClient } = require("mongodb");
// const http = require("http");

app.use("/js", express.static("js"));
app.use("/css", express.static("css"));

const credentials = fs.readFileSync("./cert.pem");

const client = new MongoClient(
  "mongodb+srv://wecycle-vancouver.2hson.mongodb.net/myFirstDatabase?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority",
  {
    sslKey: credentials,
    sslCert: credentials,
    useUnifiedTopology: true,
  }
);

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

    // removeFromDB({ name: "" });
    // addToUsersCollection(
    //   "Raymond Wong",
    //   "778-876-5432",
    //   0,
    //   120,
    //   "Heritage Mountain"
    // );
    // updateCollectionOnID({name : "Raymond Wong"}, {address : "123 Las Vegas Rd, LA"});
    console.log(testGet);

    // perform actions using client
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

function removeFromDB(objectToRemove) {
  client.connect();
  client.db("WecycleMain").collection("Users").deleteOne(objectToRemove);
  console.log("deleted successfully!");
  // client.close();
}

function addToUsersCollection(
  nameValue,
  contactNumberValue,
  bottlesDonatedValue,
  bottlesTakenValue,
  addressValue
) {
  client.connect();
  client.db("WecycleMain").collection("Users").insertOne({
    name: nameValue,
    contactNumber: contactNumberValue,
    bottlesDonated: bottlesDonatedValue,
    bottlesTaken: bottlesTakenValue,
    address: addressValue,
  });
}

function updateCollectionOnID(searchValue, key, newValue) {
  client.connect();
  client.db("WecycleMain").collection("Users").updateOne(
    {
      _id: searchValue,
    },
    {
      $set: { key: newValue },
    }
  );
}

console.log("check before the db run");
// run().catch(console.dir);

// EXPRESS METHODS

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/html/index.html");
});

app.post("/create", function (req, res) {
  res.send({ status: "success", rows, results });
});

app.get('/', function(req, res) {
    
  const connection = mysql.createTableConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      multipleStatements: true
  });

  const createDBTables = `CREATING WECYCLE DATABASE;
      use test;
      CREATE TABLE IF NOT EXISTS clients (
      ID int NOT NULL AUTO_INCREMENT,
      name varchar(30),
      email varchar(30),
      PRIMARY KEY (ID));`;

  connection.connect();
  connection.query(createDBTables, function (error, results, fields) {
      if (error) {
          throw error;
      }
  });
  connection.end();

  let doc = fs.readFileSync('./index.html', "utf8");
  res.send(doc);
})


app.get("/read-table", function (req, res) {
  res.setHeader("Content-Type", "application/json");

  // where 'client' is a constant of the mongodb atlas url + SSL certificates


  async function grabData() {
    const client = new MongoClient(
      "mongodb+srv://wecycle-vancouver.2hson.mongodb.net/myFirstDatabase?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority",
      {
        sslKey: credentials,
        sslCert: credentials,
        useUnifiedTopology: true,
      }
    );

    try {
      await client.connect();
      client.db("WecycleMain").collection("Users")
      .find()
      .toArray()
      .then((data) => {
        console.log(data);
        res.json(data); //is this part wrong?
      })
      .catch((error) => console.error(error));
    } catch (err) {
      throw new Error("didnt connect to mongodb");
    } finally {
      // await client.close();
    };

    //
  };

  
  try {
    grabData();
  } catch (err) {
    throw new Error("grab data didnt execute properly");
  }

    // client.close(); // closing the client will break the program. Why?


});

app.post("/update-table", function (req, res) {
  res.send({ status: "success", rows, results });
});

app.post("/delete-row", function (req, res) {
  res.send({ status: "success", rows, results });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
