const express = require("express")
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors")
const app = express()
require("dotenv").config()

app.use(cors())
app.use(express.json())
const port = process.env.PORT ||  5000;


app.get("/", async(req, res)=>{
    res.send("Welcome to my Server")
})


app.listen(port, ()=>{
    console.log(`Server is running, ${port}`);
})