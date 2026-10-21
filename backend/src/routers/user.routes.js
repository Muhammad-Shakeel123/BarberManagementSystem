import express from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  updateMe,
  changeMyPassword,
  uploadMyAvatar,
  removeMyAvatar,
  getAllUsers,
  updateUser,
  deleteUser,
  createCustomer,
} from "../controllers/user.controller.js";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      return callback(new Error("Only image files are allowed"));
    }
    callback(null, true);
  },
});

import {
  changePassword as changePasswordValidation,
  updateUser as updateValidation, 
} from "../validators/user.validator.js";

const router = express.Router();

router.patch("/me", authenticate, validate(updateValidation), updateMe);
router.patch("/me/password", authenticate, validate(changePasswordValidation), changeMyPassword);
router.post("/me/avatar", authenticate, upload.single("avatar"), uploadMyAvatar);
router.delete("/me/avatar", authenticate, removeMyAvatar);

router.get("/get-all-users", authenticate, authorize(["admin"]), getAllUsers);
router.post("/create-customer", authenticate, authorize(["admin"]), createCustomer); //done
router.put("/:id", authenticate, authorize(["admin"]), validate(updateValidation), updateUser);
router.delete("/:id", authenticate, authorize(["admin"]), deleteUser);

export default router;
