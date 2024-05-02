const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const dotenv = require("dotenv");
const cron = require('node-cron');
const fetch = require('node-fetch');

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


const makeUpdate = async () => {
  const response = await fetch("https://sample-mongo.vercel.app/users")
  const data = await response.json()
  console.log("Make Update is called")
  for(let values of data){
  const options = {
    method : "PUT",
    headers : {
      "Content-Type" : "application/json"
    },
    body : JSON.stringify({username:values.username,counter:values.counter+1,arr:[...values.arr,values.counter+1]})
  }
  const res1 = await fetch("https://sample-mongo.vercel.app/users/updates",options);
  const dat1 = await res1.json()
  console.log(dat1)
}
}

cron.schedule('*/60 * * * * *', async () => {
  try {
    await makeUpdate(); // Call makeUpdate function every 60 seconds
    console.log('makeUpdate executed successfully');
  } catch (error) {
    console.error('Error:', error);
  }
})

app.get("/", (req, res) => {
  res.send("Hello, I am connected");
});

app.get("/users", async (req, res) => {
  try {
    await connectToDatabase();
    const getData = await accountsCollection.find({}).toArray();
    console.log(getData)
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

app.put("/users/updates", async (req,res) => {
  console.log(req.body)
  try{
    await connectToDatabase()
    const result = await accountsCollection.updateOne({username:req.body.username},{
      $set : {counter:req.body.counter,
      arr: req.body.arr}
    })
    res.send({success:"Record Updated"})
  }
  catch(Err){
    console.log(`Error Occurred : ${Err}`)
  }
  finally {
    await client.close()
  }
})

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
