const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const dotenv = require("dotenv");

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

const uri = process.env.mongo_uri;
const client = new MongoClient(uri);
const dbname = "mdbuser_test_db";
const collection_name = "users";
let accountsCollection;

const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log(`Connected to the ${dbname} database`);
    accountsCollection = client.db(dbname).collection(collection_name);
  } catch (err) {
    console.error(`Error connecting to the database : ${err}`);
  }
};

app.get("/", (req, res) => {
  res.send("Hello, I am connected");
});

app.get("/users", async (req, res) => {
  try {
    await connectToDatabase();
    const getData = await accountsCollection.findOne({ name: "Parker" });
    res.send(getData);
  } catch (err) {
    console.log(`Error Occurred : ${err}`);
    res.status(500).send("Internal Server Error");
  } finally {
    await client.close();
  }
});

app.post("/users", async (req, res) => {
  try {
    await connectToDatabase();
    const result = await accountsCollection.insertOne(req.body);
    res.send({ success: "User inserted Successfully" });
  } catch (err) {
    console.log(`Error Occurred : ${err}`);
    res.status(500).send("Internal Server Error");
  } finally {
    await client.close();
  }
});

app.put("/users", async (req, res) => {
  const { username, newpassword } = req.body;
  try {
    await connectToDatabase();
    const res1 = await accountsCollection.findOne({ username });
    if (res1) {
      const result = await accountsCollection.updateOne(
        { username },
        { $set: { password: newpassword } }
      );
      res.send({ success: "Password Updated Successfully" });
    } else {
      res.status(404).send({ failure: "User does not exist" });
    }
  } catch (err) {
    console.log(`Error Occurred : ${err}`);
    res.status(500).send("Internal Server Error");
  } finally {
    await client.close();
  }
});

app.delete("/users", async (req, res) => {
  const { username } = req.body;
  try {
    await connectToDatabase();
    const res1 = await accountsCollection.findOne({ username });
    if (res1) {
      const result = await accountsCollection.deleteOne({ username });
      res.send({ success: "User Deleted Successfully" });
    } else {
      res.status(404).send({ failure: "User does not exist" });
    }
  } catch (err) {
    console.log(`Error Occurred : ${err}`);
    res.status(500).send("Internal Server Error");
  } finally {
    await client.close();
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is Running at http://localhost:${PORT}/`);
});
