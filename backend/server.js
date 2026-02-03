import express from "express";
import cors from "cors";
import restaurants from "./api/restaurants.route.js";
import mongodb from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8000;

app.use("/api/v1/restaurants", restaurants);

// optional root route
app.get("/", (req, res) => {
  res.json({ message: "Backend is running ✅" });
});

// 404 middleware
app.use((req, res) => {
  res.status(404).json({ error: "not found" });
});

// --- MongoDB connection ---
const MongoClient = mongodb.MongoClient;

MongoClient.connect(process.env.RESTREVIEWS_DB_URI, {
  maxPoolSize: 50,
  wtimeoutMS: 2500
})
  .then(client => {
    console.log("MongoDB connected ✅");
    const db = client.db("sample_restaurants");
    app.locals.db = db;

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch(err => {
    console.error("MongoDB connection failed ❌");
    console.error(err);
    process.exit(1);
  });

export default app;
