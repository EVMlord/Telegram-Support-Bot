import { DataTypes, Sequelize } from "sequelize";
import { Messages } from "./models/messages";
import { Blacklist } from "./models/blacklist";
import { MyContext } from "../types";
import { NextFunction } from "grammy";

if (
  process.env.MYSQL_DATABASE === undefined ||
  process.env.MYSQL_USERNAME === undefined ||
  process.env.MYSQL_PASSWORD === undefined ||
  process.env.MYSQL_HOST === undefined
) {
  throw Error("No DB provided");
}

export const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USERNAME,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
    dialect: "mysql", // Use "mysql" for MariaDB/MySQL, change to "postgres" if using PostgreSQL
    dialectModule: require("mysql2"), // Use 'mysql2' library explicitly
    dialectOptions: {
      connectTimeout: 60000, // Set timeout to 60 seconds
    },
    logging: process.env.log === "debug",
  }
);

const retryOptions = {
  max: 3, // Retry up to 3 times
  timeout: 3000, // Wait 3 seconds between each retry
};

// Function to attempt connection with retry logic
async function connectWithRetry() {
  for (let i = 0; i < retryOptions.max; i++) {
    try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");
      return; // If connection is successful, exit the loop
    } catch (error) {
      console.error(
        `Attempt ${i + 1} failed. Retrying in ${
          retryOptions.timeout / 1000
        } seconds...`
      );
      if (i < retryOptions.max - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, retryOptions.timeout)
        );
      } else {
        console.error("All retry attempts failed. Exiting...");
        throw error;
      }
    }
  }
}

Messages.init(
  {
    original_id: DataTypes.BIGINT,
    support_id: DataTypes.BIGINT,
    user_id: DataTypes.BIGINT,
  },
  {
    sequelize,
    tableName: "messages",
  }
);

Blacklist.init(
  {
    telegram_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
  },
  {
    sequelize,
    tableName: "blacklist",
  }
);

// Setup function that connects and syncs models
export async function setup(): Promise<void> {
  await connectWithRetry(); // Connect to database with retries
  await sequelize.sync(); // Sync models after successful connection
  console.log("DB Models Synced!");
}

export async function middleware(
  ctx: MyContext,
  next: NextFunction
): Promise<void> {
  ctx.db = {
    Messages: Messages,
    Blacklist: Blacklist,
  };

  return await next();
}
