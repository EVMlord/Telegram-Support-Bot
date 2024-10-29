import { VercelRequest, VercelResponse } from "@vercel/node";
import bot from "../src";

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    await bot.handleUpdate(req.body); // Process incoming Telegram update
    res.status(200).send("OK");
  } catch (error) {
    console.error("Error handling update:", error);
    res.status(500).send("Error processing update");
  }
};
