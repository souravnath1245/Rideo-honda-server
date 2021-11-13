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
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nnyci.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
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
    const userCollection = database.collection("Users");
    const clientReviews = database.collection("Client-Reviews");

    //Get Booking Client
    app.get("/bookingClient", async (req, res) => {
      const email = req.query.email;
      const date = req.query.date;
      const query = { email: email, date: date };
      const cursor = bookingClient.find(query);
      const clients = await cursor.toArray();
      res.json(clients);
    });

    //Delete Api:
    app.delete("/bookingClient/:id", async(req, res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      console.log(query);
      const result = await bookingClient.deleteOne(query);
      res.send(result)
    })

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
    app.get("/reviews", async(req,res)=>{
      const review = clientReviews.find({});
      const result=await review.toArray()
      res.send(result)
    })

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

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    app.post("/users", async (req, res) => {
      const users = req.body;
      const result = await userCollection.insertOne(users);
      console.log("server is working ", result);
      res.json(result);
    });

    app.post("/reviews", async(req, res)=>{
      const review = req.body;
      const result = await clientReviews.insertOne(review)
      console.log("we got client Reviews ", review);
      res.json(result)

    })
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    });


    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.json(result);
      // const requester = req.decodedEmail;
      // if (requester) {
      //     const requesterAccount = await usersCollection.findOne({ email: requester });
      //     if (requesterAccount.role === 'admin') {
      //         const filter = { email: user.email };
      //         const updateDoc = { $set: { role: 'admin' } };
      //         const result = await usersCollection.updateOne(filter, updateDoc);
      //         res.json(result);
      //     }
      // }
      // else {
      //     res.status(403).json({ message: 'you do not have access to make admin' })
      // }
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
