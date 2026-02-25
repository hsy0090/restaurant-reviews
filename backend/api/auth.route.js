import express from "express";
import AuthController from "./auth.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);
router.get("/me", auth, AuthController.me);

export default router;
