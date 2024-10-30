import { VercelRequest, VercelResponse } from "@vercel/node";
import bot from "../src"; // Import the initialized bot from src/index.ts
import ipRangeCheck from "ip-range-check";
import { webhookCallback } from "grammy";

const handleUpdate = webhookCallback(bot, "http");

// Define allowed IP ranges (from Telegram documentation) in CIDR notation
const allowedIPRanges = ["149.154.160.0/20", "91.108.4.0/22"];

// function createCompatibleResponse(res: VercelResponse): any {
//   return {
//     ...res,
//     set: (field: string, value: string | string[]) => {
//       res.setHeader(field, value);
//       return res;
//     },
//   };
// }

// function createCompatibleRequest(req: VercelRequest): any {
//   return {
//     ...req,
//     header: (name: string) => req.headers[name.toLowerCase()],
//   };
// }

export default async function botHandler(
  req: VercelRequest,
  res: VercelResponse
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
    return res.status(403).send("Forbidden: IP not allowed");
  }

  // Process Telegram update if the IP is allowed
  if (req.method === "POST") {
    // Wrap the Vercel request and response to make them compatible with webhookCallback
    // const compatibleReq = createCompatibleRequest(req);
    // const compatibleRes = createCompatibleResponse(res);

    // return handleUpdate(compatibleReq, compatibleRes);
    await handleUpdate(req, res);

    console.log("Finished processing update");

    return;
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
