# Telegram-Support-Bot 💭

**A simple Telegram bot designed to assist with support-related tasks.**

This repository contains the source code for a Telegram Support Bot built using [grammY](https://grammy.dev/), `express`, and `mysql2`. This bot enables streamlined communication between users and support teams on Telegram, offering an efficient way to manage queries, feedback, and support requests directly from a Telegram chat, with features for message forwarding, user blacklisting, and message handling.

## Features

- **Forwarding Messages**: Automatically forwards user messages from private chats to a support group.
- **Responding to Users**: Allows support team members to reply to user messages directly from the support group.
- **Admin Management**: Supports admin commands like `/ban` and `/pardon` to block or unblock users.
- **Webhook Support**: Configured for deployment in a serverless environment using `express` for webhook handling.
- **Database Integration**: Stores user messages and blacklist information in a MariaDB/MySQL database using `mysql2` for direct database queries.
- **Rate Limiting**: Prevents spam with customizable rate limits on user messages.
- **i18n Support**: Uses @grammyjs/i18n for multilingual support, making the bot accessible to users worldwide.
- **Modular Code Structure**: Clean and maintainable structure with modularized routes, middlewares, and handlers.
- **Deployable on Vercel**: Configured to run seamlessly on Vercel’s serverless environment with webhook support.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Commands](#commands)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [License](#license)

## Installation 🚀

1. Clone this repository:

   ```bash
   git clone https://github.com/EVMlord/telegram-support-bot.git
   cd telegram-support-bot
   ```

2. Install the necessary dependencies:

   ```bash
   yarn install
   ```

3. Copy `example.env` to `.env` and fill it with your data.

   ```bash
   cp example.env .env
   ```

4. Run the development server:

   ```bash
   yarn dev
   ```

5. Build the project:

   ```bash
   yarn build
   ```

6. Start:

   ```bash
   yarn start
   ```

## ⚒ Configuration

### Environment Variables

Create a `.env` file in the project root and set the following variables:

```env
BOT_TOKEN=your_telegram_bot_token
SUPPORT_CHAT_ID=your_support_group_id
MYSQL_HOST=your_database_host
MYSQL_PORT=3306 # or your custom port
MYSQL_DATABASE=your_database_name
MYSQL_USERNAME=your_database_user
MYSQL_PASSWORD=your_database_password
PROJECT_USERNAME=your_project_username
```

### Webhook Setup

To deploy the bot using a serverless environment, the webhook must be set up properly. The `express` server listens for incoming updates and passes them to the bot.

## 📄 Commands

The bot includes the following commands:

- **/start**: Starts interaction with the user. ¯\\\_(ツ)\_\/¯
- **/help**: Provides assistance.
- **/ban**: Bans a user (admin only, for use in support group).
- **/pardon**: Unbans a user (admin only, for use in support group).

## Project Structure

```
├── api
│   ├── bot.ts         # Express server for webhook
│   ├── setup.ts       # Endpoint for setting the webhook
│   └── status.ts      # Health check route
├── src
│   ├── bot.ts         # Bot initialization and middleware setup
│   ├── database       # Database configuration and queries
│   ├── handlers       # Handlers for different bot interactions
│   ├── middlewares    # Custom middlewares for logging, i18n, etc.
│   ├── types.d.ts     # Custom TypeScript types
│   └── index.ts       # Main bot entry point
└── README.md
```

## Usage

### Running Locally

1. Start the development server:

   ```bash
   yarn dev
   ```

   Bot will be setup with long polling: `bot.start()`.

### Deployment

Deploy the bot to a serverless platform like Vercel or AWS Lambda by ensuring your `vercel.json` file is configured properly:

```json
{
  "version": 2,
  "functions": {
    "api/bot.ts": {
      "memory": 1024,
      "maxDuration": 10
    }
  },
  "routes": [{ "src": "/.*", "dest": "api/bot.ts" }]
}
```

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE.md) file for more details.

---

Feel free to contribute, open issues, or suggest improvements. Happy coding!
