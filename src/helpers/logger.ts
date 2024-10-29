import { createLogger, format, transports } from "winston";

// import { MyContext } from "../types";
// import { NextFunction } from "grammy";

// Define custom log format
const myFormat = format.printf(
  ({ level = "", message = "", label = "", timestamp = "" }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
  }
);

const logger = createLogger({
  level: process.env.LOGGING_LEVEL || "info", // Set default log level (e.g., "info", "warn", "error", etc.)
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.splat(),
    format.simple(),
    myFormat
  ),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), myFormat),
    }), // Log to console

    // Log all messages to a file
    new transports.File({ filename: "supportbot.log" }),

    // Log only errors to a separate file
    new transports.File({
      filename: "supportbot-error.log",
      level: "error",
    }),
  ],
});

// Child loggers for specific contexts
const userLogger = logger.child({ label: "UserModule" });
const adminLogger = logger.child({ label: "AdminModule" });

export { logger, userLogger, adminLogger };
