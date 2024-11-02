import { RowDataPacket } from "mysql2/promise";
import pool from "../mysqlClient";

interface Message {
  original_id: number;
  support_id: number;
  user_id: number;
}

// Messages Model Queries
export const Messages = {
  create: async (
    originalId: number,
    supportId: number,
    userId: number
  ): Promise<void> => {
    const query =
      "INSERT INTO messages (original_id, support_id, user_id) VALUES (?, ?, ?)";
    await pool.execute(query, [originalId, supportId, userId]);
  },

  findBySupportId: async (supportId: number): Promise<Message | null> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM messages WHERE support_id = ?`,
      [supportId]
    );
    return rows.length > 0 ? (rows[0] as Message) : null;
  },
};
