const {getCommand} = require('./helpers');
const {createWgService} = require('./services/wgService');
const {createJokeService} = require('./services/jokesService');

require('dotenv').config();

const {Client, Intents} = require('discord.js');
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
const axios = require('axios').default;
const jokes = createJokeService();
const wg = createWgService();
wg.axios = axios;

client.on('ready', (_e) => {
    console.log(`Logged in as ${ client.user.tag }!`);
});
client.login(process.env.DISCORD_TOKEN);

client.on('messageCreate', (msg) => {
    if (msg.content.split(' ')[0].toLowerCase() !== process.env.BOT_NAME.toLowerCase()) {
        return
    }
    if (getCommand(msg.content,'randomJoke')) {
        jokes.getRandomJoke(msg);
    }
    if (getCommand(msg.content, 'findWgAccounts')) {
        const searchText = getCommand(msg.content, 'findWgAccounts');
        if (searchText.length) {
            wg.getWgAccounts(msg, searchText);
        }
    }
});
