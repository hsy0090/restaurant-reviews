import { ObjectId } from "mongodb";

let users;

export default class UsersDAO {
  static async injectDB(conn) {
    if (users) return;
    try {
      users = await conn
        .db(process.env.RESTREVIEWS_NS)
        .collection("user_details");
      await users.createIndex({ email: 1 }, { unique: true });
    } catch (e) {
      console.error(`Unable to establish collection handle for users: ${e}`);
    }
  }

  static async getUserByEmail(email) {
    try {
      return await users.findOne({ email: email.toLowerCase() });
    } catch (e) {
      console.error(`Unable to get user by email: ${e}`);
      return null;
    }
  }

  static async getUserById(id) {
    try {
      return await users.findOne({ _id: new ObjectId(id) });
    } catch (e) {
      console.error(`Unable to get user by id: ${e}`);
      return null;
    }
  }

  static async createUser({ name, email, passwordHash }) {
    try {
      const doc = {
        name,
        email: email.toLowerCase(),
        passwordHash,
        createdAt: new Date(),
      };
      const result = await users.insertOne(doc);
      return { ...doc, _id: result.insertedId };
    } catch (e) {
      console.error(`Unable to create user: ${e}`);
      return null;
    }
  }
}
