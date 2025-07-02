import { Router } from "express";
import { param, body, query } from "express-validator";

import getCurrentUser from "@/controller/v1/user/get_current_user";

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

export default router;
