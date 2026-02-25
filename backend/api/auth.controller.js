import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import UsersDAO from "../dao/usersDAO.js";
import RefreshTokensDAO from "../dao/refreshTokensDAO.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "dev_refresh_secret_change_me";
const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || "1d";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function createAccessToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_ACCESS_EXPIRES_IN }
  );
}

function createRefreshToken(user) {
  return jwt.sign(
    { sub: user._id.toString() },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRES_IN }
  );
}

async function storeRefreshToken(userId, refreshToken) {
  const decoded = jwt.decode(refreshToken);
  const expiresAt = decoded?.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 7 * 86400000);
  return RefreshTokensDAO.storeToken({
    userId,
    tokenHash: hashToken(refreshToken),
    expiresAt,
  });
}

export default class AuthController {
  static async register(req, res) {
    try {
      const { name, email, password } = req.body || {};
      if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required" });
      }

      const existing = await UsersDAO.getUserByEmail(email);
      if (existing) {
        return res.status(409).json({ error: "Email already in use" });
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const user = await UsersDAO.createUser({ name, email, passwordHash });

      if (!user) {
        return res.status(500).json({ error: "Failed to create user" });
      }

      const accessToken = createAccessToken(user);
      const refreshToken = createRefreshToken(user);
      await storeRefreshToken(user._id.toString(), refreshToken);

      return res.status(201).json({
        accessToken,
        refreshToken,
        user: { id: user._id.toString(), name: user.name, email: user.email },
      });
    } catch (e) {
      return res.status(500).json({ error: "Registration failed" });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body || {};
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const user = await UsersDAO.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const accessToken = createAccessToken(user);
      const refreshToken = createRefreshToken(user);
      await storeRefreshToken(user._id.toString(), refreshToken);

      return res.json({
        accessToken,
        refreshToken,
        user: { id: user._id.toString(), name: user.name, email: user.email },
      });
    } catch (e) {
      return res.status(500).json({ error: "Login failed" });
    }
  }

  static async refresh(req, res) {
    try {
      const { refreshToken } = req.body || {};
      if (!refreshToken) {
        return res.status(400).json({ error: "Missing refresh token" });
      }

      let payload;
      try {
        payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
      } catch (e) {
        return res.status(401).json({ error: "Invalid refresh token" });
      }

      const tokenHash = hashToken(refreshToken);
      const stored = await RefreshTokensDAO.findByHash(tokenHash);
      if (!stored) {
        return res.status(401).json({ error: "Refresh token not found" });
      }

      await RefreshTokensDAO.deleteByHash(tokenHash);

      const user = await UsersDAO.getUserById(payload.sub);
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      const newAccessToken = createAccessToken(user);
      const newRefreshToken = createRefreshToken(user);
      await storeRefreshToken(user._id.toString(), newRefreshToken);

      return res.json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: { id: user._id.toString(), name: user.name, email: user.email },
      });
    } catch (e) {
      return res.status(500).json({ error: "Refresh failed" });
    }
  }

  static async logout(req, res) {
    try {
      const { refreshToken } = req.body || {};
      if (!refreshToken) {
        return res.status(400).json({ error: "Missing refresh token" });
      }
      const tokenHash = hashToken(refreshToken);
      await RefreshTokensDAO.deleteByHash(tokenHash);
      return res.json({ status: "ok" });
    } catch (e) {
      return res.status(500).json({ error: "Logout failed" });
    }
  }

  static async me(req, res) {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    return res.json({ user: req.user });
  }
}
