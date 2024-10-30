import { NextFunction } from "grammy";
import { logger } from "../helpers/logger";
import { MyContext } from "../types";

async function logging(ctx: MyContext, next: NextFunction): Promise<void> {
  // General update log
  logger.debug(
    `New update received. Update ID: ${ctx.update.update_id} by User ID: ${ctx.from?.id}`
  );
  console.debug(
    `New update received. Update ID: ${ctx.update.update_id} by User ID: ${ctx.from?.id}`
  );

  // Log text messages
  if (ctx.message?.text) {
    logger.info(
      `Text message from ${ctx.from?.first_name} ${ctx.from?.last_name} (ID: ${ctx.from?.id}): "${ctx.message.text}"`
    );
    console.info(
      `Text message from ${ctx.from?.first_name} ${ctx.from?.last_name} (ID: ${ctx.from?.id}): "${ctx.message.text}"`
    );
  }
  // Log callback queries
  else if (ctx.callbackQuery) {
    logger.info(
      `Callback query from ${ctx.from?.first_name} ${ctx.from?.last_name} (ID: ${ctx.from?.id}): "${ctx.callbackQuery.data}"`
    );
    console.info(
      `Callback query from ${ctx.from?.first_name} ${ctx.from?.last_name} (ID: ${ctx.from?.id}): "${ctx.callbackQuery.data}"`
    );
  }
  // Log photo messages
  else if (ctx.message?.photo) {
    logger.info(
      `Photo message from ${ctx.from?.first_name} ${ctx.from?.last_name} (ID: ${ctx.from?.id}): File ID: ${ctx.message.photo[0]?.file_id}`
    );
    console.info(
      `Photo message from ${ctx.from?.first_name} ${ctx.from?.last_name} (ID: ${ctx.from?.id}): File ID: ${ctx.message.photo[0]?.file_id}`
    );
  }
  // Log other media types or unsupported messages
  else {
    logger.debug(
      `Unsupported message type from ${ctx.from?.first_name} ${ctx.from?.last_name} (ID: ${ctx.from?.id})`
    );
    console.debug(
      `Unsupported message type from ${ctx.from?.first_name} ${ctx.from?.last_name} (ID: ${ctx.from?.id})`
    );
  }

  // Proceed to the next middleware
  await next();
}

export { logging };
