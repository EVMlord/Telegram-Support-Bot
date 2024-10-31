import { IncomingMessage, ServerResponse } from "http";
import statusHandler from "./status";
import setupHandler from "./setup";
import botHandler from "./bot";

export default async function mainHandler(
  req: IncomingMessage,
  res: ServerResponse
) {
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
    res.statusCode = 404;
    res.end("Not Found");
  } catch (error) {
    console.error("Error handling request:", error);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}
