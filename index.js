const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express');
const cors = require("cors");
const dontenv = require('dotenv');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dontenv.config();

const uri = process.env.MONGODB_URI;


const app = express();
const port = process.env.PORT

app.use(cors());
app.use(express.json());

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
    const db = client.db('doctor_appointment');
    const usersCollection = db.collection('alldoctor');

    app.get('/alldoctor',async(req,res)=>{
        const result = await usersCollection.find().toArray();
        res.send(result);
    });

    app.get('/alldoctor/:id', async (req, res) => {
      const { id } = req.params;
      query = {
        _id: new ObjectId(id)
        
      };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Hello World');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


