import { DataTypes, Sequelize } from "sequelize";
import { Messages } from "./models/messages";
import { Blacklist } from "./models/blacklist";
import { MyContext } from "../types";
import { NextFunction } from "grammy";
import { logger } from "../helpers/logger";

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
    pool: {
      max: 5, // Maximum number of active connections in the pool
      min: 0, // Minimum number of active connections in the pool
      acquire: 30000, // Maximum time (in ms) to try getting a connection before throwing an error
      idle: 10000, // Time (in ms) after which an idle connection is released back to the pool
    },
    logging: process.env.log === "debug" ? console.log : false,
  }
);

async function connectWithRetry() {
  let attempts = 0;
  const maxRetries = 3;
  const retryInterval = 3000; // 3 seconds

  while (attempts < maxRetries) {
    try {
      attempts += 1;
      logger.info(`Attempt ${attempts} to connect to the database.`);
      await sequelize.authenticate();
      logger.info("Database connection established successfully.");
      return; // Exit the function if connection is successful
    } catch (error) {
      logger.error(`Database connection attempt ${attempts} failed: ${error}`);
      if (attempts >= maxRetries) {
        logger.error("Max retry attempts reached. Database connection failed.");
        // Optionally, handle the error gracefully without process.exit
        throw new Error(
          "Failed to connect to the database after maximum attempts."
        );
      }
      logger.info(`Retrying in ${retryInterval / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, retryInterval));
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
