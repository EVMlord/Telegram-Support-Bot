import { Composer } from "grammy";
import { MyContext } from "../types";
import { actionsMenu } from "../keyboards/userActions";
import bot from "../bot";
import { logger } from "../helpers/logger"; // Optional: Add logger for better debugging

const SUPPORT_CHAT_ID = process.env.SUPPORT_CHAT_ID;

if (!SUPPORT_CHAT_ID) {
  throw new Error("No SUPPORT_CHAT_ID provided!");
}

export const composer = new Composer<MyContext>();

// Handle messages from private chats
const messageToSupport = composer.chatType("private");
messageToSupport.use(actionsMenu);
messageToSupport.on("message", async (ctx) => {
  try {
    // Check if the user is blacklisted
    const isBlacklisted = await ctx.db.Blacklist.findOne({
      where: { telegram_id: ctx.chat?.id },
    });
    if (isBlacklisted) return;

    // Forward the message to the support chat
    const supportMessage = await ctx.copyMessage(SUPPORT_CHAT_ID, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: `${ctx.from?.first_name} ${ctx.from?.last_name ?? ""}`,
              url: ctx.from?.username
                ? `https://t.me/${ctx.from.username}`
                : "https://t.me/EVMlord",
            },
          ],
        ],
      },
    });

    // Save message details to the database
    await ctx.db.Messages.create({
      original_id: ctx.message!.message_id,
      support_id: supportMessage.message_id,
      user_id: ctx.message!.chat.id,
    });

    // React to the user's message to confirm receipt
    await ctx.react("💯");
  } catch (error) {
    logger.error(`Failed to process user message: ${error}`);
    await ctx.reply(ctx.t("error.unknown"));
  }
});

// Handle messages in the support group to respond to users
const messageToUser = composer.chatType(["group", "supergroup"]);
messageToUser.use(actionsMenu);
messageToUser.on("message", async (ctx) => {
  try {
    // Ensure the message is a reply to a bot message
    if (ctx.message?.reply_to_message?.from?.id !== (await bot.api.getMe()).id)
      return;

    // Find the original message in the database
    const original = await ctx.db.Messages.findOne({
      where: { support_id: ctx.message?.reply_to_message?.message_id },
    });

    if (!original) {
      return await ctx.reply(ctx.t("error.not_found"));
    }

    // Forward the message back to the original user
    await ctx.copyMessage(original.user_id, {
      reply_to_message_id: original.original_id,
    });
  } catch (error) {
    // Handle errors, such as when the user has blocked the bot
    logger.error(`Failed to send message to user: ${error}`);
    await ctx.reply(ctx.t("error.blocked"));
  }
});

export { messageToSupport, messageToUser };
