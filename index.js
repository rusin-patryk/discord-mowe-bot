const {getCommand} = require('./helpers');
const {createWgService} = require('./services/wgService');
const {createJokeService} = require('./services/jokesService');

require('dotenv').config();

const {
    Client,
    Intents,
} = require('discord.js');
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
const jokes = createJokeService();
const wg = createWgService();

client.on('ready', (_e) => {
    console.log(`Logged in as ${ client.user.tag }!`);
});
client.login(process.env.DISCORD_TOKEN);

client.on('messageCreate', (msg) => {
    if (msg.content.toLowerCase() === 'ping') {
        msg.reply('pong');
        return;
    }
    if (msg.content.split(' ')[0].toLowerCase() !== process.env.BOT_NAME.toLowerCase()) {
        return;
    }
    if (getCommand(msg.content, 'randomJoke')) {
        jokes.getRandomJoke(msg);
        return;
    }
    if (getCommand(msg.content, 'findWgAccounts')) {
        const searchText = getCommand(msg.content, 'findWgAccounts');
        if (searchText.length) {
            wg.getAccounts(msg, searchText);
        }
        return;
    }
    if (getCommand(msg.content, 'findWgClans')) {
        const searchText = getCommand(msg.content, 'findWgClans');
        if (searchText.length) {
            wg.getClans(msg, searchText);
        }
        return;
    }
    if (getCommand(msg.content, 'findWgStats')) {
        const searchText = getCommand(msg.content, 'findWgStats');
        if (searchText.length) {
            wg.getAccountStats(msg, searchText);
        }
    }
});
