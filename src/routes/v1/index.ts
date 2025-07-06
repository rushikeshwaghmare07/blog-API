import { Router } from "express";
const router = Router();

import authRoutes from "@/routes/v1/auth";
import userRoutes from "@/routes/v1/user";
import blogRoutes from "@/routes/v1/blog";

// Root route
router.get("/", (req, res) => {
  res.status(200).json({
    message: "API is live",
    status: "ok",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/blogs", blogRoutes);

export default router;
