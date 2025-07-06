import { Router } from "express";
import { param, query, body } from "express-validator";
import multer from "multer";

import createBlog from "@/controller/v1/blog/create_blog";

import authenticate from "@/middlewares/authenticate";
import authorize from "@/middlewares/authorize";
import validationError from "@/middlewares/validationError";
import uploadBlogBanner from "@/middlewares/uploadBlogBanner";

const router = Router();
const upload = multer();

router.post(
  "/",
  authenticate,
  authorize(["admin"]),
  upload.single("banner_image"),
  body("title")
  .trim()
  .notEmpty()
  .withMessage("Title is required")
    .isLength({ max: 180 })
    .withMessage("Title must be less than 180 characters"),
    body("content").trim().notEmpty().withMessage("Content is required"),
    body("status")
    .optional()
    .isIn(["draft", "published"])
    .withMessage("Status must be one of the value, draft or published"),
    validationError,
  uploadBlogBanner("post"),
  createBlog,
);

export default router;
