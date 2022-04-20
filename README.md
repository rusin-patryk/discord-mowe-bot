# # Discord MOWE Bot

## About project

Discord MOWE Bot is a bot to use on Discord's servers. Main bot features are fetching statistics from Wargaming API, help with server administration etc.

## How to use

1. Install [node.js](https://nodejs.org/en/), version `16.0.0` or higher.
2. Use `npm install` command.
3. Register Discord Application [here](https://discord.com/developers/applications).
4. Add bot's permissions, generate OAuth URL and use this URL to add bot to the server.
5. Generate and copy bot token.
6. Create `.env` file with environment variable in the following format:
```dotenv
DISCORD_TOKEN=INSERT_TOKEN_HERE
```
6. Use `node index.js` to run script and authenticate bot program.
