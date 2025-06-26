import winston from "winston";
import config from "@/config";

const { combine, timestamp, json, colorize, errors, align, printf } =
  winston.format;

const transports: winston.transport[] = [];

if (config.NODE_ENV !== "production") {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: "YYYY-MM-DD hh:mm:ss A" }),
        align(),
        printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length
            ? `\n${JSON.stringify(meta)}`
            : "";

          return `${timestamp} [${level}]: ${message}${metaStr}`;
        }),
      ),
    }),

    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  );
}

// logger instance
const logger = winston.createLogger({
  level: config.LOG_LEVEL || "info",
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports,
  silent: config.NODE_ENV === "test",
});

export { logger };
