import { limit } from "@grammyjs/ratelimiter";
import { MyContext } from "../types";

const ratelimiter = limit<MyContext, never>({
  // Allow only 1 message to be handled every 3 seconds.
  timeFrame: 3000,
  limit: 1,

  // "MEMORY_STORE" is the default value. If you do not want to use Redis, do not pass storageClient at all.
  // storageClient: redis,

  // This is called when the limit is exceeded.
  onLimitExceeded: async (ctx) => {
    await ctx.reply("Please refrain from sending too many requests!");
  },

  // Note that the key should be a number in string format such as "123456789".
  keyGenerator: (ctx) => {
    return ctx.from?.id.toString() || "unknown";
  },
});

export { ratelimiter };
