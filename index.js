require('dotenv').config();
const express = require('express');
const app = express()
const cors = require('cors');
const port = 5000

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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

    app.get('/properties/:propertyId', async (req, res) => {
      const { propertyId } = req.params;
      const result = await propertyCollection.findOne({ _id: new ObjectId(propertyId) });
      res.json(result);
    })


    // app.get('/properties', async (req, res) => {
    //   const query = {};
    //   if(req.query.ownerId){
    //     query.ownerId=req.query.ownerId;
    //   }
    //   if(req.query.status){
    //     query.status=req.query.status;
    //   }
    //   const cursor = propertyCollection.find(query);
    //   const result = await cursor.toArray();
    //   res.send(result);
    // })

    app.post('/properties', async (req, res) => {
      const propertyData = req.body;
      const result = await propertyCollection.insertOne(propertyData);
    })

    app.patch('/properties/:propertyId', async (req, res) => {
      const { propertyId } = req.params;
      const updatedData = req.body;
      const result = await propertyCollection.updateOne(
        { _id: new ObjectId(propertyId) },
        { $set: { status: updatedData.status } });
      res.json(result);
    })

    app.patch('/properties/:id', async (req, res) => {
      const { id } = req.params;
      const updatedData = req.body;
      const result = await propertyCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData });
      res.json(result);
    })

    app.delete('/properties/:propertyId', async (req, res) => {
      const { propertyId } = req.params;
      const result = await propertyCollection.deleteOne({ _id: new ObjectId(propertyId) });
      res.json(result);
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