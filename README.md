# # Discord MOWE Bot

## About project

Discord MOWE Bot is a bot to use on Discord's servers. Main bot features are fetching statistics from Wargaming API, help with server administration etc.

## How to run

1. Install [node.js](https://nodejs.org/en/), version `16.0.0` or higher.
2. Use `npm install` command.
3. Register Discord Application [here](https://discord.com/developers/applications).
4. Add bot's permissions, generate OAuth URL and use this URL to add bot to the server.
5. Generate and copy bot token.
6. Register Wargaming Application (mobile) and copy APP ID.
7. Create `.env` file with environment variables in the following format:
```dotenv
DISCORD_TOKEN=INSERT_DISCORD_APP_TOKEN_HERE
WARGAMING_ID=INSERT_WARGAMIN_APP_ID_HERE
BOT_NAME=INSERT_BOT_NAME_HERE
```
8. Use `node index.js` to run script and authenticate bot program.

## How to use

1. Type `{BOT_NAME} tell a joke` for print random joke.
2. Type `{BOT_NAME} find: {wows_player_nickname}` for print found users, account ID and URL to wows-numbers stats.
3. Type `{BOT_NAME} find clan: {clan_name_or_tag}` for print found clans and URL to wows-numbers page of the clan.
4. Type `{BOT_NAME} stats: {wows_player_nickname}` for print user stats. The nickname must be valid to find the appropriate user.

### This is a draft version. I'm still developing a bot so you can expect new features soon.
