import { ObjectId } from "mongodb";

let refreshTokens;

export default class RefreshTokensDAO {
  static async injectDB(conn) {
    if (refreshTokens) return;
    try {
      refreshTokens = await conn
        .db(process.env.RESTREVIEWS_NS)
        .collection("refresh_tokens");
      await refreshTokens.createIndex({ tokenHash: 1 }, { unique: true });
      await refreshTokens.createIndex({ userId: 1 });
      await refreshTokens.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    } catch (e) {
      console.error(`Unable to establish refresh_tokens collection: ${e}`);
    }
  }

  static async storeToken({ userId, tokenHash, expiresAt }) {
    try {
      const doc = {
        userId: new ObjectId(userId),
        tokenHash,
        createdAt: new Date(),
        expiresAt,
      };
      await refreshTokens.insertOne(doc);
      return doc;
    } catch (e) {
      console.error(`Unable to store refresh token: ${e}`);
      return null;
    }
  }

  static async findByHash(tokenHash) {
    try {
      return await refreshTokens.findOne({ tokenHash });
    } catch (e) {
      console.error(`Unable to find refresh token: ${e}`);
      return null;
    }
  }

  static async deleteByHash(tokenHash) {
    try {
      return await refreshTokens.deleteOne({ tokenHash });
    } catch (e) {
      console.error(`Unable to delete refresh token: ${e}`);
      return null;
    }
  }
}
