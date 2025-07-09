import { Router } from "express";
import { param, query, body } from "express-validator";
import multer from "multer";

import createBlog from "@/controller/v1/blog/create_blog";
import getAllBlogs from "@/controller/v1/blog/get_all_blogs";
import getBlogsByUser from "@/controller/v1/blog/get_blogs_by_user";
import getBlogBySlug from "@/controller/v1/blog/get_glob_by_slug";
import updateBlog from "@/controller/v1/blog/update_blog";

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

router.get(
  "/",
  authenticate,
  authorize(["admin", "user"]),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 to 50"),
  query("offset")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Offset must be a positive integer"),
  validationError,
  getAllBlogs,
);

router.get(
  "/user/:userId",
  authenticate,
  authorize(["admin", "user"]),
  param("userId").isMongoId().withMessage("Invalid user Id"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 to 50"),
  query("offset")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Offset must be a positive integer"),
  validationError,
  getBlogsByUser,
);

router.get(
  "/:slug",
  authenticate,
  authorize(["admin", "user"]),
  param("slug").notEmpty().withMessage("Slug is required"),
  validationError,
  getBlogBySlug,
);

router.put(
  "/:blogId",
  authenticate,
  authorize(["admin"]),
  param("blogId").isMongoId().withMessage("Invalid blog ID"),
  upload.single("banner-image"),
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 180 })
    .withMessage("Title must be less than 180 characters"),
  body("content"),
  body("status")
    .optional()
    .isIn(["draft", "published"])
    .withMessage("Status must be one of the value, draft or published"),
  validationError,
  uploadBlogBanner("put"),
  updateBlog,
);

export default router;
