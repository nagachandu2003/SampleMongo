const express = require("express")
const cors = require("cors")
const {MongoClient,ObjectId} = require("mongodb")
const dotenv = require("dotenv")
// const cors = require("cors")

const app = express();
app.use(express.json())
app.use(cors())
app.use(cors(
    {
        origin : 'https://sample-mongo-gi3o.vercel.app/'
    }
))
dotenv.config()

// Connection String
const uri = process.env.mongo_uri;
// console.log(uri)
const client = new MongoClient(uri)
const dbname = "mdbuser_test_db";
const collection_name = "users";

const accountsCollection = client.db(dbname).collection(collection_name)


const connectToDatabase = async () => {
    try{
        await client.connect()
        console.log(`Connected to the ${dbname} database`);
    }
    catch(err){
        console.error(`Error connecting to the database : ${err}`);
    }
};



// Sample Data
const sampleAccount = [{
    account_holder:"Ada Lovelace",
    account_id : "MDB011235813",
    account_type : "checking",
    balance : 60218
},
{
    account_holder:"Muhammad ibn Musa al-Khwarizmi",
    account_id : "MDB829000001",
    account_type : "savings",
    balance : 267914296
}]


// Filter used to update the document
const documentsToUpdate = {account_type:"checking"}
const update = {$push : {transfers_complete:"TR413308000"}}

// const documentToUpdate = { _id : ObjectId("62d6e04ecab6d8e130497482")}
// // console.log(documentToUpdate)
// const update = {$inc : {balance:100}}
//Connecting to the db
// connectToDatabase()

const InsertDoc = async () => {
    try{
        let result = await accountsCollection.insertMany(sampleAccount);
        console.log(`Inserted Documents Count : ${result.insertedCount}`)
        console.log(result)
    }
    catch(err){
        console.log(`Error inserting document : ${err}`)
    }
    finally{
        await client.close()
    }
}
// InsertDoc()

let finalRes;

const FindDoc = async () => {
    try{
        await connectToDatabase()
        let result = await accountsCollection.findOne({balance:{$gt:4700}})
        console.log(result)
        // await result.forEach((doc) => console.log(doc))
    }
    catch(Err){
        console.log(`Error Occurred : ${Err}`);
    }
    finally{
        await client.close()
    }
}
// FindDoc()

const UpdateDoc = async () => {
    try{
        let result = await accountsCollection.updateMany(documentsToUpdate,update);
        result.modifiedCount>0?
        console.log(`Updated documents : ${result.modifiedCount}`)
        :console.log("No documents updated")
    }
    catch(Err){
        console.log(`Error updating document : ${Err}`);
    }
    finally{
        await client.close()
    }
}

// UpdateDoc()

const DeleteDoc = async () => {
    try{
        await connectToDatabase()
        const result = await accountsCollection.deleteOne({_id:new ObjectId('66138a769008ebc0bc0b45d0')})
        console.log(result)
        result.deletedCount===1?
        console.log(`Delete 1 record`)
        :console.log("No Record is Deleted")
    }
    catch(Err){
        console.log(`Error Deleting the record : ${Err}`)
    }
    finally{
        await client.close()
    }
}
// DeleteDoc()

app.get("/",(req,res) => {
    res.send("Hello I am connected")
    // res.send(finalRes)
})

app.get("/users", async (req,res) => {
    // console.log("I am called from backend")
    try{
        await connectToDatabase()
        const getData = await accountsCollection.findOne({name:"Parker"})
        // console.log(getData)
        res.send(getData)
    }
    catch(Err){
        console.log(`Error Occurrd : ${Err}`)
    }
    finally{
        await client.close()
    }
    // res.send("I am from Users backend")
})

// 6613a198c0b8da0c45ed1b02
// 6613a392dc493bbd31e4cc89

app.post("/users", async (req,res) => {
    try{
        await connectToDatabase()
        const result = await accountsCollection.insertOne(req.body)
        console.log(`Inserted Object with ID : ${result.insertedId}`)
        res.send({success:"User inserted Successfully"})
    }
    catch(Err){
        console.log(`Error Occurred : ${Err}`);
    }
    finally{
        await client.close()
    }
})

app.put("/users",async (req,res) => {
    const {username,newpassword} = req.body
    try{
        await connectToDatabase()
        const res1 = await accountsCollection.findOne({username})
        if(res1){
        const result = await accountsCollection.updateOne({username},{$set : {password:newpassword}})
        res.send({success:"Password Updated Successfully"})
        }
        else
        res.send({failure:"User does not exists"})
    }
    catch(Err){
        console.log(`Error Occurred : ${Err}`)
    }
    finally{
        await client.close()
    }
})

app.delete("/users",async (req,res) => {
    const {username} = req.body
    console.log(username)
    try{
        await connectToDatabase()
        const res1 = await accountsCollection.findOne({username})
        if(res1){
        const result = await accountsCollection.deleteOne({username})
        res.send({success:"User Deleted Successfully"})
        }
        else
        res.send({failure:"User does not exists"})
    }
    catch(Err){
        console.log(`Error Occurred : ${Err}`)
    }
    finally{
        await client.close()
    }
})

app.listen(3001,() => {
    console.log("Server is Running at http://localhost:3001/")
})