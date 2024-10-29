import { Bot } from "grammy";
import { MyContext } from "../types";
import i18n from "../middlewares/i18n";
import { logger } from "../helpers/logger"; // Optional: Import logger for error tracking
import { LanguageCode } from "grammy/types";

async function setupBotCommands(bot: Bot<MyContext>): Promise<void> {
  for (const locale of i18n.locales) {
    try {
      // Set bot commands
      await bot.api.setMyCommands(
        [
          { command: "start", description: i18n.t(locale, "bot.start") },
          { command: "help", description: i18n.t(locale, "bot.help") },
        ],
        { language_code: locale as LanguageCode } // Cast locale
      );

      // Set bot description
      await bot.api.setMyDescription(i18n.t(locale, "bot.description"), {
        language_code: locale as LanguageCode, // Cast locale
      });

      // Set bot short description
      await bot.api.setMyShortDescription(i18n.t(locale, "bot.about"), {
        language_code: locale as LanguageCode, // Cast locale
      });

      logger.info(
        `Commands, descriptions, and short descriptions set for locale: ${locale}`
      );
    } catch (error) {
      logger.error(`Failed to set commands for locale ${locale}: ${error}`);
    }
  }
}

export { setupBotCommands };
