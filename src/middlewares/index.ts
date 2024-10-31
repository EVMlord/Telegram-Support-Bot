import { Bot } from "grammy";

import i18n from "./i18n";

import { logging } from "./logging";

import { ratelimiter } from "./ratelimiter";

import { MyContext } from "../types";

import { middleware as database } from "../database";
import { autoRetry } from "./autoretry";

async function setup(bot: Bot<MyContext>): Promise<void> {
  // Apply the autoRetry middleware
  bot.api.config.use(autoRetry);

  // Apply the i18n middleware for localization
  bot.use(i18n.middleware());
  //   bot.use(i18n);

  // Apply other middlewares
  bot.use(logging);

  bot.use(database);

  bot.use(ratelimiter);
}

export default { setup };
