const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 7254;
const app = express();
require("dotenv").config();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const userName = process.env.USER;
const password = process.env.PASSWORD;

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${userName}:${password}@cluster0.q4a9c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const userCollection = client.db("DIU_CPC").collection("users");
    const eventRegistration = client
      .db("DIU_CPC")
      .collection("event_registration");

    // user routes
    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const result = await userCollection.findOne({ email: email });
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // events
    app.get("/events", async (req, res) => {
      const result = await eventRegistration.find().toArray();
      res.send(result);
    });

    app.post("/events", async (req, res) => {
      const user = req.body;
      const result = await eventRegistration.insertOne(user);
      res.send(result);
    });

    // event registration
    app.get("/eventsRegistration/:email", async (req, res) => {
      const email = req.params.email;
      const result = await eventRegistration.findOne({ email: email });
      res.send(result);
    });

    app.post("/eventsRegistration/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await eventRegistration.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from the server!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`http://localhost:${port}`);
});
