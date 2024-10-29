import dotenv from "dotenv";
dotenv.config(); // This will load environment variables from .env file

import { parseMode } from "@grammyjs/parse-mode";
import bot from "./bot";
import middlewares from "./middlewares";
import { setup as setupHandlers } from "./handlers";
import { setupBotCommands } from "./helpers/bot-commands";
import { logger } from "./helpers/logger";
import { setup as setupDatabase } from "./database";

async function init() {
  try {
    // Setup middlewares
    middlewares.setup(bot);

    // Setup handlers
    await setupHandlers(bot);

    // Setup database
    await setupDatabase();

    // Register bot commands
    await setupBotCommands(bot);

    // Configure bot to parse HTML in messages
    bot.api.config.use(parseMode("HTML"));

    // Start the bot
    await bot.start();

    logger.info("Bot started successfully");
  } catch (error) {
    logger.error(`Bot initialization failed: ${error}`);
    process.exit(1); // Exit with failure code if initialization fails
  }
}

init();
