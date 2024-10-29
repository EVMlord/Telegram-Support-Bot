import { Composer } from "grammy";
import { MyContext } from "../types";
import { projectUsername } from "..";

export const composer = new Composer<MyContext>();

// Help message for private chats
composer.chatType("private").command(["start", "help"], async (ctx) => {
  try {
    await ctx.reply(
      ctx.t("help.dm", {
        name: ctx.from?.first_name || "User",
        username: projectUsername,
      })
    );
  } catch (error) {
    console.error("Failed to send private help message:", error);
  }
});

// Help message for group and supergroup chats
composer
  .chatType(["group", "supergroup"])
  .command(["start", "help"], async (ctx) => {
    try {
      await ctx.reply(ctx.t("help.group"));
    } catch (error) {
      console.error("Failed to send group help message:", error);
    }
  });
