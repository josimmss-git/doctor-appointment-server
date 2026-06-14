const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("doctor_appointment");

    const doctorsCollection = db.collection("alldoctor");
    const appointmentsCollection = db.collection("appointments");

    // ==========================
    // Get All Doctors
    // ==========================
    app.get("/alldoctor", async (req, res) => {
      try {
        const result = await doctorsCollection.find().toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // ==========================
    // Get Single Doctor
    // ==========================
    app.get("/alldoctor/:id", async (req, res) => {
      try {
        const { id } = req.params;

        const result = await doctorsCollection.findOne({
          _id: new ObjectId(id),
        });

        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // ==========================
    // Create Appointment
    // ==========================
   app.post("/bookings", async (req, res) => {
  try {
    const booking = req.body;

    const result = await appointmentsCollection.insertOne({
      ...booking,
      status: "pending",
      createdAt: new Date(),
    });

    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

    // ==========================
    // Get User Appointments
    // ==========================
    app.get("/appointments/:email", async (req, res) => {
      try {
        const email = req.params.email;

        const result = await appointmentsCollection
          .find({ userEmail: email })
          .toArray();

        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // ==========================
    // Delete Appointment
    // ==========================
    app.delete("/appointments/:id", async (req, res) => {
      try {
        const id = req.params.id;

        const result = await appointmentsCollection.deleteOne({
          _id: new ObjectId(id),
        });

        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // ==========================
    // Update Appointment Status
    // ==========================
    app.patch("/appointments/:id", async (req, res) => {
      try {
        const id = req.params.id;

        const result = await appointmentsCollection.updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              status: "confirmed",
            },
          }
        );

        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    await client.db("admin").command({ ping: 1 });

    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
}

run().catch(console.dir);

// Root Route
app.get("/", (req, res) => {
  res.send("Doctor Appointment Server Running...");
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});