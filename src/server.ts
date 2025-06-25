import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";

import config from "@/config";
import limiter from "@/lib/express_rate_limit";
import { connectToDatabase, disconnectFromDatabase } from "@/lib/mongoose";

import v1Routes from "@/routes/v1";

import type { CorsOptions } from "cors";

const app = express();
const PORT = config.PORT;

const CorsOptions: CorsOptions = {
  origin(origin, callback) {
    if (config.NODE_ENV === "development" || !origin) {
      callback(null, true);
    } else {
      callback(
        new Error(`CORS error: ${origin} is not allowed by CORS`),
        false,
      );
      console.log(`CORS error: ${origin} is not allowed by CORS`);
    }
  },
};

// Middlewares
app.use(cors(CorsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  compression({
    threshold: 1024,
  }),
);
app.use(helmet());
app.use(limiter);

(async () => {
  try {
    await connectToDatabase();

    app.use("/api/v1", v1Routes);

    app.listen(PORT, () => {
      console.log(`Server running: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Failed to start the server: ", error);

    if (config.NODE_ENV === "production") {
      process.exit(1);
    }
  }
})();

const handleServerShutdown = async () => {
  try {
    await disconnectFromDatabase();
    console.log("Server SHUTDOWN");
    process.exit(0);
  } catch (error) {
    console.log("Error during server shutdown: ", error);
  }
};

// Gracefully handle server shutdown on termination signals
process.on("SIGTERM", handleServerShutdown);
process.on("SIGINT", handleServerShutdown);
