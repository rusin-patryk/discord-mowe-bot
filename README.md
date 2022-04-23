# # Discord MOWE Bot

## About project

Discord MOWE Bot is a bot to use on Discord's servers. Main bot features are fetching users, clans, statistics from
Wargaming API, help with server administration etc.

### This is a draft version. I'm still developing a bot so you can expect new features soon.

## How to run

1. Install [node.js](https://nodejs.org/en/), version `16.0.0` or higher.
2. Use `npm install` command.
3. Register Discord Application [here](https://discord.com/developers/applications).
4. Add bot's permissions, generate OAuth URL and use this URL to add bot to the server.
5. Generate and copy bot token.
6. Register Wargaming Application (mobile) [here](https://developers.wargaming.net/applications/) and copy APP ID.
7. Create `.env` file with environment variables in the following format:

```dotenv
DISCORD_TOKEN=INSERT_DISCORD_APP_TOKEN_HERE
WARGAMING_ID=INSERT_WARGAMIN_APP_ID_HERE
WARGAMING_SERVER=INSER_WARGAMING_SERVER
BOT_NAME=INSERT_BOT_NAME_HERE
```
Wargaming servers: `eu`, `ru`, `asia`, na (type `com` instead).

8. Use `node index.js` to run script and authenticate bot program.
   ![image](https://user-images.githubusercontent.com/68754966/164335697-c9595d88-c78d-46bd-bd2f-f8ce684a2caa.png)

## How to use

1. Type `{BOT_NAME} tell a joke` for print random joke.
   
![image](https://user-images.githubusercontent.com/68754966/164335892-4bde2858-3ea4-4b77-a202-d346c980939c.png)

2. Type `{BOT_NAME} find: {wows_player_nickname}` for print found users, account ID and URL to wows-numbers stats.

![image](https://user-images.githubusercontent.com/68754966/164335531-1364ef63-8a4e-4d8b-9a47-869192cfebee.png)
![image](https://user-images.githubusercontent.com/68754966/164335936-0b732c8d-0b78-4ae5-9ee3-7b8a47f99a8a.png)

3. Type `{BOT_NAME} find clan: {clan_name_or_tag}` for print found clans and URL to wows-numbers page of the clan.

![image](https://user-images.githubusercontent.com/68754966/164336000-f0b2ce0f-ed07-4c04-aae3-589984bd6d35.png)

4. Type `{BOT_NAME} stats: {wows_player_nickname}` for print user stats. The nickname must be valid to find the
    appropriate user (I'm working on it to add PR, colors etc.).

![image](https://user-images.githubusercontent.com/68754966/164336065-747864ac-2ae6-4b5c-8774-858c10a88801.png)

## Sources of data

- I'm using [WoWS-Numbers.com](https://wows-numbers.com/) for [PR](https://wows-numbers.com/personal/rating) formula & colors calculation.
- I'm using [Wargaming API](https://developers.wargaming.net/reference/all/wows/) for fetching info about players.
- I'm using [ICNDb.com](https://www.icndb.com/) for fetching jokes.
