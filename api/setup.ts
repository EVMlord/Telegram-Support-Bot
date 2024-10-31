import { IncomingMessage, ServerResponse } from "http";
import bot from "../src";

export default async function setupHandler(
  req: IncomingMessage,
  res: ServerResponse
) {
  try {
    // get host name from .env or req
    const customDomain = process.env.CUSTOM_DOMAIN;
    const host = customDomain
      ? customDomain
      : (req.headers["x-forwarded-host"] as string); // x-forwarded-host contains custom domain from vercel

    const webhookUrl = `https://${host}/api/bot`;

    // Set the webhook for Telegram
    await bot.api.setWebhook(webhookUrl, {
      allowed_updates: [
        "message",
        "channel_post",
        "inline_query",
        "poll",
        "poll_answer",
        "my_chat_member",
        "chat_join_request",
        "chat_boost",
        "removed_chat_boost",
        "chat_member",
        "message_reaction",
        "message_reaction_count",
      ],
    });

    res.statusCode = 200;
    res.end("Webhook set up successfully.");
  } catch (error) {
    console.error("Error setting up webhook:", error);
    res.statusCode = 500;
    res.end("Error setting up webhook.");
  }
}
