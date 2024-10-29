import { VercelRequest, VercelResponse } from "@vercel/node";
import bot from "../src";

export default async function setupHandler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    // get host name from req
    const host = req.headers.host;
    const webhookUrl = `https://${host}/api/bot`;

    // Set the webhook for Telegram
    await bot.api.setWebhook(webhookUrl, {
      allowed_updates: [
        "message",
        // "channel_post",
        "inline_query",
        "poll",
        "poll_answer",
        "my_chat_member",
        "chat_join_request",
        // "chat_boost",
        // "removed_chat_boost",
        "chat_member",
        "message_reaction",
        "message_reaction_count",
      ],
    });

    res.status(200).send("Webhook set up successfully.");
  } catch (error) {
    console.error("Error setting up webhook:", error);
    res.status(500).send("Error setting up webhook.");
  }
}
