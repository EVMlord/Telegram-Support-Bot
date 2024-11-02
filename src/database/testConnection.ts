import dotenv from "dotenv";
dotenv.config(); // This will load environment variables from .env file

import { testInitialConnection } from "./mysqlClient";

async function testConnection() {
  try {
    await testInitialConnection();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

testConnection();
