import { Composer } from "grammy";
import { MyContext } from "../types";

export const composer = new Composer<MyContext>();
const ban = composer.chatType(["group", "supergroup"]);

// Function to find user from a replied message
async function findUser(ctx: MyContext) {
  if (!ctx.message?.reply_to_message) {
    await ctx.reply(ctx.t("ban.no_reply"));
    return null;
  }

  const supportId = ctx.message.reply_to_message.message_id;
  const message = await ctx.db.Messages.findBySupportId(supportId);

  if (!message) {
    await ctx.reply(ctx.t("error.not_found"));
    return null;
  }

  return message;
}

ban.command("ban", async (ctx: MyContext) => {
  const message = await findUser(ctx);
  if (message) {
    await ctx.db.Blacklist.add(message.user_id);
    await ctx.reply(ctx.t("ban.done"));
  }
});

ban.command("pardon", async (ctx: MyContext) => {
  const message = await findUser(ctx);
  if (message) {
    await ctx.db.Blacklist.remove(message.user_id);
    await ctx.reply(ctx.t("ban.pardon"));
  }
});
