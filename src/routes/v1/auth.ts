import { Router } from "express";
import { body, cookie } from "express-validator";
import bcrypt from "bcrypt";

import register from "@/controller/v1/auth/register";
import login from "@/controller/v1/auth/login";
import refreshToken from "@/controller/v1/auth/refresh_token";

import User from "@/models/user";

import validationError from "@/middlewares/validationError";

const router = Router();

router.post(
  "/register",
  body("email")
    .isEmail()
    .withMessage("Invalid email address")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isLength({ max: 50 })
    .withMessage("Email must be less than 50 characters")
    .custom(async (value) => {
      const userExists = await User.exists({ email: value });
      if (userExists) {
        throw new Error("User already exists");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("role")
    .optional()
    .isString()
    .withMessage("Role must be a string")
    .isIn(["admin", "user"])
    .withMessage("Role must be either admin or user"),
  validationError,
  register,
);

router.post(
  "/login",
  body("email")
    .isEmail()
    .withMessage("Invalid email address")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isLength({ max: 50 })
    .withMessage("Email must be less than 50 characters")
    .custom(async (value) => {
      const userExists = await User.exists({ email: value });
      if (!userExists) {
        throw new Error("Invalid credentials");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .custom(async (value, { req }) => {
      const { email } = req.body as { email: string };
      const user = await User.findOne({ email })
        .select("password")
        .lean()
        .exec();

      if (!user) {
        throw new Error("Invalid credentials");
      }

      const passwordMatch = await bcrypt.compare(value, user.password);

      if (!passwordMatch) {
        throw new Error("Invalid credentials");
      }
    }),
  validationError,
  login,
);

router.post(
  "/refresh-token",
  cookie("refreshToken")
  .notEmpty()
  .withMessage("Refresh token required")
  .isJWT()
  .withMessage("Invalid refresh token"),
  validationError,
  refreshToken
);

export default router;
