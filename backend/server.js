import express from "express";
import cors from "cors";
import restaurants from "./api/restaurants.route.js";
import authRoutes from "./api/auth.route.js";
import RestaurantsDAO from "./dao/restaurantsDAO.js";
import ReviewsDAO from "./dao/reviewsDAO.js";
import UsersDAO from "./dao/usersDAO.js";
import RefreshTokensDAO from "./dao/refreshTokensDAO.js";
import mongodb from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/v1/restaurants", restaurants);
app.use("/api/v1/auth", authRoutes);
app.use((req, res) => res.status(404).json({ error: "not found" }));

const port = process.env.PORT || 5000;

async function main() {
  try {
    const client = await mongodb.MongoClient.connect(process.env.RESTREVIEWS_DB_URI, {
      maxPoolSize: 50,
      wtimeoutMS: 2500
    });

    await RestaurantsDAO.injectDB(client);
    await ReviewsDAO.injectDB(client);
    await UsersDAO.injectDB(client);
    await RefreshTokensDAO.injectDB(client);

    app.listen(port, () => console.log(`Server listening on port ${port}`));
  } catch (e) {
    console.error("MongoDB connection failed", e);
  }
}

main();

export default app;
