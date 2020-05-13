const express = require("express");
const app = express();
const { MongoClient, ObjectID } = require("mongodb");
const assert = require("assert");
// body-parser middleware
app.use(express.json());

// Connect to the DB
const MongoURI = "mongodb://localhost:27017";
const DB = "contactlist";

MongoClient.connect(
  MongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    assert.equal(err, null, "failed to connect to the DB...💣🤯");
    const db = client.db(DB);
    console.log("connected to the DB...🚀  ");
    // API Route

    //get Contact List
    app.get("/contact_list", (req, res) => {
      db.collection("listcontact")
        .find("")
        .toArray()
        .then((data) => res.send(data))

        .catch((err) => console.log("You can't get any contact...😥 "));
    });
    // get one of contact list
    app.get("/contact_list/:id", (req, res) => {
      const id = ObjectID(req.params.id);
      db.collection("listcontact")
        .findOne({ _id: id })
        .then((data) => res.send(data))
        .catch((err) => console.log("Sorry, we couldn't get this contact"));
    });

    // Create a new contact
    app.post("/contact_list", (req, res) => {
      const newcontact = req.body;
      db.collection("listcontact")
        .insertOne({ ...newcontact })
        .then((data) => res.send(data))
        .catch((err) => res.send("cannot post...."));
    });

    // Update a one of the Contact List
    app.put("/contact_list/:id", (req, res) => {
      const id = ObjectID(req.params.id);
      const contactlist = req.body;
      console.log(contactlist);
      db.collection("listcontact")
        .findOneAndUpdate({ _id: id }, { $set: { contactlist } })
        .then((data) => res.send({ success: true }))
        .catch((err) => console.error(err));
    });
    // Delete one of the contact List
    app.delete("/contact_list/:id", (req, res) => {
        const id = req.params.id;
        db.collection("listcontact")
        .findOneAndDelete({_id:id})
        .then(data=> res.send({success:"you have successfully delete ..!"}))
    });
  }
);

// server
const PORT = 8000;

app.listen(PORT, (err) => {
  if (err) console.log("Failed to connect...");
  else console.log(`...Server is running on port ${PORT} `);
});
