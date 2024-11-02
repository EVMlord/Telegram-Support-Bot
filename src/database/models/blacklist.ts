import { RowDataPacket } from "mysql2/promise";
import pool from "../mysqlClient";

// Blacklist Model Queries
export const Blacklist = {
  add: async (telegramId: number) => {
    const query = "INSERT INTO blacklist (telegram_id) VALUES (?)";
    await pool.execute(query, [telegramId]);
  },

  remove: async (telegramId: number) => {
    const query = "DELETE FROM blacklist WHERE telegram_id = ?";
    await pool.execute(query, [telegramId]);
  },

  isBlacklisted: async (telegramId: number) => {
    const query = "SELECT 1 FROM blacklist WHERE telegram_id = ?";
    const [rows] = await pool.execute<RowDataPacket[]>(query, [telegramId]);
    return rows.length > 0;
  },
};
