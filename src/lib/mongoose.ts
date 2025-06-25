import mongoose from "mongoose";
import config from "@/config";

import type { ConnectOptions } from "mongoose";

const clientOptions: ConnectOptions = {
  dbName: "blog-db",
  appName: "Blog API",
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
};

export const connectToDatabase = async (): Promise<void> => {
  if (!config.MONGO_URI) {
    throw new Error("MongoDB URI is not defined in the configuration.");
  }

  try {
    const connection = await mongoose.connect(config.MONGO_URI, clientOptions);

    const dbHost = connection.connection.host;
    const dbName = connection.connection.name;

    console.log(`Connected to MongoDB at host: ${dbHost}, database: ${dbName}`);

    if (config.NODE_ENV === "development") {
      console.log("MongoDB client options:", {
       options: clientOptions
      });
    }
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("Error connecting to the database", err);
    throw err;
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();

    console.log("Disconnected from MongoDB successfully.");
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("Error disconnecting from the MongoDB", err);
    throw err;
  }
};
