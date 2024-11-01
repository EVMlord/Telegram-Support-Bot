// import dotenv from "dotenv";
// dotenv.config(); // This will load environment variables from .env file

import { sequelize } from ".";

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  } finally {
    await sequelize.close();
  }
}

testConnection();
