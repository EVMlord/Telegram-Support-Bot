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

  const message = await ctx.db.Messages.findOne({
    where: { support_id: ctx.message?.reply_to_message.message_id },
  });

  if (!message) {
    await ctx.reply(ctx.t("error.not_found"));
    return null;
  }

  return message;
}

ban.command("ban", async (ctx: MyContext) => {
  const message = await findUser(ctx);
  if (message) {
    await ctx.db.Blacklist.create({ telegram_id: message.user_id });
    await ctx.reply(ctx.t("ban.done"));
  }
});

ban.command("pardon", async (ctx: MyContext) => {
  const message = await findUser(ctx);
  if (message) {
    await ctx.db.Blacklist.destroy({ where: { telegram_id: message.user_id } });
    await ctx.reply(ctx.t("ban.pardon"));
  }
});
