import { Bot } from "grammy";
import { MyContext } from "../types";

import { composer as helpHandler } from "./help";
import { composer as banHandler } from "./ban";
import { composer as messageHandler } from "./message";
import { errorHandler } from "./error";

export async function setup(bot: Bot<MyContext>): Promise<void> {
  // Register the handlers
  bot.use(helpHandler);
  bot.use(banHandler);
  bot.use(messageHandler);

  // Error handling middleware
  bot.catch(errorHandler);
}
