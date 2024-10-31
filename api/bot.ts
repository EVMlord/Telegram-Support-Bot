import { IncomingMessage, ServerResponse } from "http";
import bot from "../src"; // Import the initialized bot from src/index.ts
import ipRangeCheck from "ip-range-check";
import { webhookCallback } from "grammy";

const handleUpdate = webhookCallback(bot, "http");

// Define allowed IP ranges (from Telegram documentation) in CIDR notation
const allowedIPRanges = ["149.154.160.0/20", "91.108.4.0/22"];

export default async function botHandler(
  req: IncomingMessage,
  res: ServerResponse
) {
  console.log("Webhook received an update");

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
    res.statusCode = 403;
    return res.end("Forbidden: IP not allowed");
  }

  // Process Telegram update if the IP is allowed
  if (req.method === "POST") {
    await handleUpdate(req, res);

    console.log("Finished processing update");

    return;
  } else {
    res.statusCode = 405;
    res.end("Method Not Allowed");
  }
}
