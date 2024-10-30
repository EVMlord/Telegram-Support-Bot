import { VercelRequest, VercelResponse } from "@vercel/node";
import bot from "../src"; // Import the initialized bot from src/index.ts
import ipRangeCheck from "ip-range-check";

// Define allowed IP ranges (from Telegram documentation) in CIDR notation
const allowedIPRanges = ["149.154.160.0/20", "91.108.4.0/22"];

export default async function botHandler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Initialize bot if not already initialized
  if (!bot.isInited()) {
    await bot.init();
  }

  // Get the client IP
  const origin = (req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "") as string;

  // Check if the IP is within the allowed ranges
  const ipAllowed = allowedIPRanges.some((subnet) =>
    ipRangeCheck(origin, subnet)
  );
  if (!ipAllowed) {
    console.error("Forbidden: IP not allowed");
    return res.status(403).send("Forbidden: IP not allowed");
  }

  // Process Telegram update if the IP is allowed
  if (req.method === "POST") {
    try {
      await bot.handleUpdate(req.body); // Process incoming Telegram update
      res.status(200).send("OK");
    } catch (error) {
      console.error("Error handling update:", error);
      res.status(500).send("Error processing update");
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
