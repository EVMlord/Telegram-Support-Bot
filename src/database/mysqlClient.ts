import mysql, { Pool } from "mysql2/promise";
import { logger } from "../helpers/logger";

if (
  !process.env.MYSQL_DATABASE ||
  !process.env.MYSQL_USERNAME ||
  !process.env.MYSQL_PASSWORD ||
  !process.env.MYSQL_HOST
) {
  throw new Error("Database configuration variables are missing");
}

// Define the pool options
const pool: Pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 5, // Maximum number of active connections in the pool
  queueLimit: 0, // Unlimited queue limit for connection requests
});

export async function connectWithRetry() {
  let attempts = 0;
  const maxRetries = 3;
  const retryInterval = 3000; // 3 seconds

  while (attempts < maxRetries) {
    try {
      attempts += 1;
      logger.info(`Attempt ${attempts} to connect to the database.`);
      const connection = await pool.getConnection();
      await connection.ping(); // Test the connection
      connection.release(); // Release the connection back to the pool
      logger.info("Database connection established successfully.");
      return; // Exit the function if connection is successful
    } catch (error) {
      logger.error(`Database connection attempt ${attempts} failed: ${error}`);
      if (attempts >= maxRetries) {
        logger.error("Max retry attempts reached. Database connection failed.");
        throw new Error(
          "Failed to connect to the database after maximum attempts."
        );
      }
      logger.info(`Retrying in ${retryInterval / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, retryInterval));
    }
  }
}

// Function to test the pool connection
export async function testInitialConnection(): Promise<void> {
  try {
    logger.info("Attempting to connect to the database pool...");
    const connection = await pool.getConnection();
    logger.info("Database connection established successfully.");
    connection.release(); // Release the connection back to the pool
  } catch (error) {
    logger.error(`Database connection failed: ${error}`);
    throw new Error("Failed to connect to the database.");
  }
}

// Export the pool to be used in queries
export default pool;
