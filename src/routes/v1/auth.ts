import { Router } from "express";
import { body } from "express-validator";

import register from "@/controller/v1/auth/register";
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

export default router;
