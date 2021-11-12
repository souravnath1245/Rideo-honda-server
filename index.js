const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
require("dotenv").config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// rideo-shop
// qSWCft37tDIzGBYl

const uri =
  "mongodb+srv://rideo-shop:qSWCft37tDIzGBYl@cluster0.nnyci.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("Rideo-shop");
    const databaseCollection = database.collection("Products");
    const bookingClient = database.collection("Client-Booking");

    //Get Booking Client
    app.get("/bookingClient", async (req, res) => {
      const email = req.query.email;
      const date = req.query.date;
      const query = { email: email, date: date };
      const cursor = bookingClient.find(query);
      const clients = await cursor.toArray();
      res.json(clients);
    });

    // Get Single Product
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await databaseCollection.findOne(query);
      console.log("Loaded Single Product ", id);
      res.send(result);
    });

    //Get Product
    app.get("/products", async (req, res) => {
      const product = databaseCollection.find({});
      const result = await product.toArray();
      res.send(result);
    });

    //Post Product
    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      const result = await productBooking.insertOne(newProduct);
      console.log("Hitting The Post Products", result);
      res.json(result);
    });

    //Post Booking Client :
    app.post("/bookingClient", async (req, res) => {
      const bookingProduct = req.body;
      console.log("adding Client Id : ", bookingProduct);
      const result = await bookingClient.insertOne(bookingProduct);
      res.json(result);
    });
  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("Welcome to my Server");
});

app.listen(port, () => {
  console.log(`Server is running, ${port}`);
});
