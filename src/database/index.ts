import { connectWithRetry } from "./mysqlClient";
import { MyContext } from "../types";
import { NextFunction } from "grammy";
import { Messages } from "./models/messages";
import { Blacklist } from "./models/blacklist";

if (
  process.env.MYSQL_DATABASE === undefined ||
  process.env.MYSQL_USERNAME === undefined ||
  process.env.MYSQL_PASSWORD === undefined ||
  process.env.MYSQL_HOST === undefined
) {
  throw Error("Database configuration variables are missing");
}

// Setup function that connects and syncs models
export async function setup(): Promise<void> {
  await connectWithRetry(); // Connect to database with retries
  console.log("DB Models Synced!");
}

// Middleware to add database utilities to the context
export async function middleware(
  ctx: MyContext,
  next: NextFunction
): Promise<void> {
  // Assign existing model queries to `ctx.db` for use in the bot
  ctx.db = {
    Messages,
    Blacklist,
  };

  return await next();
}
