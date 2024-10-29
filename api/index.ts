import { VercelRequest, VercelResponse } from "@vercel/node";
import statusHandler from "./status";
import setupHandler from "./setup";
import botHandler from "./bot";

export default async function mainHandler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    // Home page: display server status
    if (req.url === "/" || req.url === "/api") {
      return statusHandler(res);
    }

    // Handle the `/setup` route to set the webhook
    if (req.url === "/api/setup") {
      return setupHandler(req, res);
    }

    // Handle the `/bot` route for Telegram webhook
    if (req.url === "/api/bot") {
      return botHandler(req, res);
    }

    // Default response for undefined routes
    res.status(404).send("Not Found");
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).send("Internal Server Error");
  }
}
