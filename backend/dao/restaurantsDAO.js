let restaurants
import { ObjectId } from "mongodb"

export default class RestaurantsDAO {
  static async injectDB(conn) {
    if (restaurants) return

    try {
      restaurants = await conn
        .db(process.env.RESTREVIEWS_NS)
        .collection("restaurants")

      console.log("RestaurantsDAO initialized ✅");
    } catch (e) {
      console.error(`Unable to establish collection handle: ${e}`)
    }
  }

    static async getRestaurants({
    filters = null,
    page = 0,
    restaurantsPerPage = 20,
  } = {}) {
    if (!restaurants) {
      console.error("restaurants variable undefined in DAO");
      // instead of throwing, return default
      return { restaurantsList: [], totalNumRestaurants: 0 };
    }

    let query = {};

    if (filters) {
      if ("name" in filters) {
        query = { $text: { $search: filters.name } };
      } else if ("cuisine" in filters) {
        query = { cuisine: { $eq: filters.cuisine } };
      } else if ("zipcode" in filters) {
        query = { "address.zipcode": { $eq: filters.zipcode } };
      }
    }

    try {
      const cursor = restaurants.find(query);
      const displayCursor = cursor
        .limit(restaurantsPerPage)
        .skip(restaurantsPerPage * page);

      const restaurantsList = await displayCursor.toArray();
      const totalNumRestaurants = await restaurants.countDocuments(query);

      return { restaurantsList, totalNumRestaurants };
    } catch (e) {
      console.error(`Unable to issue find command: ${e}`);
      return { restaurantsList: [], totalNumRestaurants: 0 }; // safe fallback
    }
  }

  static async getRestaurantByID(id) {
    try {
      const pipeline = [
        {
            $match: {
                _id: new ObjectId(id),
            },
        },
              {
                  $lookup: {
                      from: "reviews",
                      let: {
                          id: "$_id",
                      },
                      pipeline: [
                          {
                              $match: {
                                  $expr: {
                                      $eq: ["$restaurant_id", "$$id"],
                                  },
                              },
                          },
                          {
                              $sort: {
                                  date: -1,
                              },
                          },
                      ],
                      as: "reviews",
                  },
              },
              {
                  $addFields: {
                      reviews: "$reviews",
                  },
              },
          ]
      return await restaurants.aggregate(pipeline).next()
    } catch (e) {
      console.error(`Something went wrong in getRestaurantByID: ${e}`)
      throw e
    }
  }

  static async getCuisines() {
    let cuisines = []
    try {
      cuisines = await restaurants.distinct("cuisine")
      return cuisines
    } catch (e) {
      console.error(`Unable to get cuisines, ${e}`)
      return cuisines
    }
  }
}
