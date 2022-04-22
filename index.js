const {
    getCommand,
    getUserLocale,
    getColorValue,
} = require('./helpers');
const {createWgService} = require('./services/wgService');
const {createJokeService} = require('./services/jokesService');
const {messages} = require('./constants/messages');

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
        return;
    }
    // TODO use array for this or whatever that isn't so stupid..
    if (getCommand(msg.content, 'showColors')) {
        wg.getStatsColors().then((colors) => {
            let message = `**${ messages[getUserLocale(msg)].COLORS_MEANING }**`;
            message += `\n:red_circle: - ${ messages[getUserLocale(msg)].BAD }`;
            message += `\nPR: \`0-${ getColorValue(colors, 'rating', '#FE0E00') }\`,`;
            message += ` WR: \`0-${ getColorValue(colors, 'win_rate', '#FE0E00') }%\`,`;
            message += ` Battles: \`0-${ getColorValue(colors, 'battles', '#FE0E00') }\`,`;
            message += ` Avg frags: \`0-${ getColorValue(colors, 'average_frags', '#FE0E00') }\`, `;
            message += `\n:orange_circle: - ${ messages[getUserLocale(msg)].BELOW_AVG }`;
            message += `\nPR: \`${ getColorValue(colors, 'rating', '#FE0E00') }-${ getColorValue(colors, 'rating', '#FE7903') }\`,`;
            message += ` WR: \`${ getColorValue(colors, 'win_rate', '#FE0E00') }-${ getColorValue(colors, 'win_rate', '#FE7903') }%\`,`;
            message += ` Battles: \`${ getColorValue(colors, 'battles', '#FE0E00') }-${ getColorValue(colors, 'battles', '#FE7903') }\`,`;
            message += ` Avg frags: \`${ getColorValue(colors, 'average_frags', '#FE0E00') }-${ getColorValue(colors, 'average_frags', '#FE7903') }\`, `;
            message += `\n:yellow_circle: - ${ messages[getUserLocale(msg)].AVG }`;
            message += `\nPR: \`${ getColorValue(colors, 'rating', '#FE7903') }-${ getColorValue(colors, 'rating', '#FFC71F') }\`,`;
            message += ` WR: \`${ getColorValue(colors, 'win_rate', '#FE7903') }-${ getColorValue(colors, 'win_rate', '#FFC71F') }%\`,`;
            message += ` Battles: \`${ getColorValue(colors, 'battles', '#FE7903') }-${ getColorValue(colors, 'battles', '#FFC71F') }\`,`;
            message += ` Avg frags: \`${ getColorValue(colors, 'average_frags', '#FE7903') }-${ getColorValue(colors, 'average_frags', '#FFC71F') }\`, `;
            message += `\n:green_circle: - ${ messages[getUserLocale(msg)].GOOD }`;
            message += `\nPR: \`${ getColorValue(colors, 'rating', '#FFC71F') }-${ getColorValue(colors, 'rating', '#44B300') }\`,`;
            message += ` WR: \`${ getColorValue(colors, 'win_rate', '#FFC71F') }-${ getColorValue(colors, 'win_rate', '#44B300') }%\`,`;
            message += ` Battles: \`${ getColorValue(colors, 'battles', '#FFC71F') }-${ getColorValue(colors, 'battles', '#44B300') }\`,`;
            message += ` Avg frags: \`${ getColorValue(colors, 'average_frags', '#FFC71F') }-${ getColorValue(colors, 'average_frags', '#44B300') }\`, `;
            message += `\n:green_square: - ${ messages[getUserLocale(msg)].VERY_GOOD }`;
            message += `\nPR: \`${ getColorValue(colors, 'rating', '#44B300') }-${ getColorValue(colors, 'rating', '#318000') }\`,`;
            message += ` WR: \`${ getColorValue(colors, 'win_rate', '#44B300') }-${ getColorValue(colors, 'win_rate', '#318000') }%\`,`;
            message += `\n:blue_circle: - ${ messages[getUserLocale(msg)].GREAT }`;
            message += `\nPR: \`${ getColorValue(colors, 'rating', '#318000') }-${ getColorValue(colors, 'rating', '#02C9B3') }\`,`;
            message += ` WR: \`${ getColorValue(colors, 'win_rate', '#318000') }-${ getColorValue(colors, 'win_rate', '#02C9B3') }%\`,`;
            message += ` Battles: \`${ getColorValue(colors, 'battles', '#44B300') }-${ getColorValue(colors, 'battles', '#02C9B3') }\`,`;
            message += ` Avg frags: \`${ getColorValue(colors, 'average_frags', '#44B300') }-${ getColorValue(colors, 'average_frags', '#02C9B3') }\`, `;
            message += `\n:purple_circle: - ${ messages[getUserLocale(msg)].UNICUM }`;
            message += `\nPR: \`${ getColorValue(colors, 'rating', '#02C9B3') }-${ getColorValue(colors, 'rating', '#D042F3') }\`,`;
            message += ` WR: \`${ getColorValue(colors, 'win_rate', '#02C9B3') }-${ getColorValue(colors, 'win_rate', '#D042F3') }%\`,`;
            message += ` Battles: \`${ getColorValue(colors, 'battles', '#02C9B3') }-${ getColorValue(colors, 'battles', '#D042F3') }\`,`;
            message += ` Avg frags: \`${ getColorValue(colors, 'average_frags', '#02C9B3') }-${ getColorValue(colors, 'average_frags', '#D042F3') }\`, `;
            message += `\n:purple_square: - ${ messages[getUserLocale(msg)].SUPER_UNICUM }`;
            message += `\nPR: \`${ getColorValue(colors, 'rating', '#D042F3') }-${ getColorValue(colors, 'rating', '#A00DC5') }\`,`;
            message += ` WR: \`${ getColorValue(colors, 'win_rate', '#D042F3') }-${ getColorValue(colors, 'win_rate', '#A00DC5') }%\`,`;
            msg.reply(message);
        });
    }
});
