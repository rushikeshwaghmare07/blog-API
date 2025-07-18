import { Router } from "express";
import { param, body, query } from "express-validator";

import getCurrentUser from "@/controller/v1/user/get_current_user";
import updateCurrentUser from "@/controller/v1/user/update_current_user";
import deleteCurrentUser from "@/controller/v1/user/delete_current_user";
import getAllUsers from "@/controller/v1/user/get_all_user";
import getUser from "@/controller/v1/user/get_user";
import deleteUser from "@/controller/v1/user/delete_user";

import authenticate from "@/middlewares/authenticate";
import validationError from "@/middlewares/validationError";
import authorize from "@/middlewares/authorize";

import User from "@/models/user";

const router = Router();

router.get(
  "/current",
  authenticate,
  authorize(["admin", "user"]),
  getCurrentUser,
);

router.put(
  "/current",
  authenticate,
  authorize(["admin", "user"]),
  body("username")
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage("Username must be less than 20 characters")
    .custom(async (value) => {
      const userExist = await User.exists({ username: value });
      if (userExist) {
        throw new Error("This username is already in use");
      }
    }),
  body("email")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Email must be less than 50 characters")
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (value) => {
      const userExist = await User.exists({ email: value });
      if (userExist) {
        throw new Error("This email is already in use");
      }
    }),
  body("password")
    .optional()
    .isLength({ max: 8 })
    .withMessage("Password must be less than 8 characters")
    .isStrongPassword()
    .withMessage(
      "Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character.",
    ),
  body("first_name")
    .optional()
    .isLength({ max: 20 })
    .withMessage("First name must be less than 20 characters"),
  body("last_name")
    .optional()
    .isLength({ max: 20 })
    .withMessage("Last name must be less than 20 characters"),
  body(["website", "linkedin", "facebook", "youtube", "instagram", "x"])
    .optional()
    .isURL()
    .withMessage("Invalid URL")
    .isLength({ max: 100 })
    .withMessage("Url must be less than 100 characters"),
  validationError,
  updateCurrentUser,
);

router.delete(
  "/current",
  authenticate,
  authorize(["admin", "user"]),
  deleteCurrentUser,
);

router.get(
  "/",
  authenticate,
  authorize(["admin"]),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 to 50"),
  query("offset")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Offset must be a positive integer"),
  validationError,
  getAllUsers,
);

router.get(
  "/:userId",
  authenticate,
  authorize(["admin"]),
  param("userId").notEmpty().isMongoId().withMessage("Invalid userId"),
  validationError,
  getUser,
);

router.delete(
  "/:userId",
  authenticate,
  authorize(["admin"]),
  param("userId").notEmpty().isMongoId().withMessage("Invalid userId"),
  validationError,
  deleteUser,
);

export default router;
