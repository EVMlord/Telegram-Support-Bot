import { Request, Response } from "express";
import statusHandler from "./status";
import setupHandler from "./setup";
import botHandler from "./bot";

export default async function mainHandler(req: Request, res: Response) {
  try {
    // Handle the `/bot` route for Telegram webhook
    if (req.url === "/api/bot") {
      return botHandler(req, res);
    }

    // Handle the `/setup` route to set the webhook
    if (req.url === "/api/setup") {
      return setupHandler(req, res);
    }

    // Home page: display server status
    if (/^\/(api\/?)?$/.test(String(req.url))) {
      // use regex to match /, /api and /api/
      return statusHandler(res);
    }

    // Default response for undefined routes
    res.status(404).send("Not Found");
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).send("Internal Server Error");
  }
}
