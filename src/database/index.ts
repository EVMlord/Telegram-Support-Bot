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

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USERNAME,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
    dialect: "mysql", // Use "mysql" for MariaDB/MySQL, change to "postgres" if using PostgreSQL
    logging: process.env.log === "debug",
  }
);

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

export async function setup(): Promise<void> {
  await sequelize.sync();
  // console.log("DB Models Synced!");
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
