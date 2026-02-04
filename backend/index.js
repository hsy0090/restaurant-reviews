import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import RestaurantsDAO from "../dao/restaurantsDAO.js";

dotenv.config();

const MongoClient = mongodb.MongoClient;
const port = process.env.PORT || 8000;

MongoClient.connect(process.env.RESTREVIEWS_DB_URI, {
  maxPoolSize: 50,
  wtimeoutMS: 2500
})
  .then(async client => {
    console.log("MongoDB connected ✅");

    await RestaurantsDAO.injectDB(client);

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch(err => {
    console.error("MongoDB connection failed ❌");
    console.error(err);
    process.exit(1);
  });
