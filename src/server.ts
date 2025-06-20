import express from "express";
import cors from "cors";

import config from "@/config";

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

app.use(cors(CorsOptions));

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
