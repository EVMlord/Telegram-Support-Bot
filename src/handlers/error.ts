import { BotError, GrammyError, HttpError } from "grammy";
import { MyContext } from "../types";
import { logger } from "../helpers/logger";

async function errorHandler(err: BotError<MyContext>): Promise<void> {
  const ctx: MyContext = err.ctx;
  const e = err.error;

  // Log general error information
  logger.error(`[!] Update ${ctx.update.update_id} by ${ctx.from?.id} failed!`);
  //   logger.error(`[!] Update ${ctx.update.update_id} by ${ctx.from?.id} failed!`);

  // Handle different error types with detailed logging
  if (e instanceof BotError) {
    // logger.error(`> BotError: ${e.ctx}`);
    logger.error(`> BotError: Context - ${JSON.stringify(e.ctx.update)}`);
  } else if (e instanceof GrammyError) {
    logger.error(
      `> GrammyError: ${e.description} (Error Code: ${e.error_code})`
    );
  } else if (e instanceof HttpError) {
    logger.error(`> HttpError: ${e.name} - ${e.message}`);
    // logger.error(`> HttpError: ${e}`);
  } else {
    logger.error(`> Unknown Error: ${e}`);
  }

  // Attempt to notify the user of an unknown error
  try {
    await ctx.reply(
      ctx.t("error.unknown") ||
        "An unknown error occurred. Please try again later."
    );
  } catch (replyError) {
    logger.error("> Failed to send error reply to user.");
  }
}

export { errorHandler };
