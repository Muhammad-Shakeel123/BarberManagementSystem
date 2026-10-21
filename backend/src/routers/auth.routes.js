import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { register, login, logout } from "../controllers/auth.controller.js";
import {
  register as registerValidation,
  login as loginValidation,
} from "../validators/auth.validator.js";

const router = express.Router();

router.post("/register", validate(registerValidation), register);
router.post("/login", validate(loginValidation), login);
router.post("/logout", authenticate, logout);

export default router;
