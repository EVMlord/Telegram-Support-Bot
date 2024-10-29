import { VercelRequest, VercelResponse } from "@vercel/node";
import bot from "../src"; // Import the initialized bot from src/index.ts

export default async function botHandler(
  req: VercelRequest,
  res: VercelResponse
) {
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
