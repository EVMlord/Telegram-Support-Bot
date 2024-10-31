import express, { NextFunction, Request, Response } from "express";
import bot from "../src"; // Import the initialized bot from src/index.ts
import ipRangeCheck from "ip-range-check";
import { webhookCallback } from "grammy";
import statusHandler from "./status";
import setupHandler from "./setup";

const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define allowed IP ranges (from Telegram documentation) in CIDR notation
const allowedIPRanges = ["149.154.160.0/20", "91.108.4.0/22"];

// Middleware to check IP
function checkIP(req: Request, res: Response, next: NextFunction): void {
  const clientIP = (req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress) as string;

  if (clientIP) {
    // Check if the IP is within the allowed ranges
    const ipAllowed = allowedIPRanges.some((subnet) =>
      ipRangeCheck(clientIP, subnet)
    );

    if (!ipAllowed) {
      console.warn(`403 - Blocked request from IP: ${clientIP}`);
      res.status(403).send("Access Denied");
      return;
    }
  } else {
    console.warn(`Unable to detect client IP`);
    res.status(403).send("Access Denied");
    return;
  }

  next();
}

// Set up the webhook route with IP check
app.post("/api/bot", checkIP, webhookCallback(bot, "express"));

// Handle the `/setup` route to set the webhook
app.get("/setup", setupHandler);

// Optional health check route (no IP restriction)
app.get("/", statusHandler);

export default app;
