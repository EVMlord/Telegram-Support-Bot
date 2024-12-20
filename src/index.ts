import dotenv from "dotenv";
dotenv.config(); // This will load environment variables from .env file

import { parseMode } from "@grammyjs/parse-mode";
import bot from "./bot";
import middlewares from "./middlewares";
import { setup as setupHandlers } from "./handlers";
import { setupBotCommands } from "./helpers/bot-commands";
import { logger } from "./helpers/logger";
import { setup as setupDatabase } from "./database";

export const projectUsername = process.env.PROJECT_USERNAME || "";

async function initBot() {
  try {
    // Configure bot to parse HTML in messages
    bot.api.config.use(parseMode("HTML"));

    // Setup database first
    await setupDatabase();
    logger.info("Database initialized and models synced successfully.");

    // Setup middlewares
    middlewares.setup(bot);

    // Setup handlers
    await setupHandlers(bot);

    // Register bot commands
    await setupBotCommands(bot);

    // Conditionally start bot with long polling in development
    if (process.env.NODE_ENV === "development") {
      await bot.start({
        allowed_updates: ["chat_member", "message", "message_reaction"],
      });
      logger.info("Bot started in development mode with long polling");
    } else {
      logger.info("Bot initialized for webhook mode (production)");
    }

    logger.info("Bot started successfully");
  } catch (error) {
    logger.error(`Bot initialization failed: ${error}`);
    // No process.exit(1) here for serverless compatibility
    // process.exit(1); // Exit with failure code if initialization fails
  }
}

// Initialize the bot within an immediately invoked async function
(async () => {
  await initBot();
  // Initialize bot if not already initialized
  if (!bot.isInited()) {
    logger.info("Initializing bot!");
    await bot.init();
  }
})();

// Export the initialized bot for use in Vercel functions
export default bot;
