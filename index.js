require('dotenv').config();
const express = require('express');
const app = express()
const cors = require('cors');
const port = 5000

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db("lodgelink");
    const propertyCollection = db.collection("properties");
    // const bookingCollection = db.collection("propertiesBooked");

    app.get('/properties', async (req, res) => {
      const result = await propertyCollection.find().toArray();
      res.json(result);
    })

    app.post('/properties', async (req, res) => {
      const propertyData = req.body;
      const result = await propertyCollection.insertOne(propertyData);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})