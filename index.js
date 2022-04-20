const axios = require('axios').default;
// Setup our environment variables via dotenv
require('dotenv').config();
// Import relevant classes from discord.js
const {
    Client,
    Intents,
} = require('discord.js');
// Instantiate a new client with some necessary parameters.
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
// Notify progress
client.on('ready', function(e) {
    console.log(`Logged in as ${ client.user.tag }!`);
});
// Authenticate
client.login(process.env.DISCORD_TOKEN);

//Example Functionality
client.on('messageCreate', function(msg) {
    if (msg.content === "Janusz opowiedz żart!") {
        getJoke(msg);
    }
    if (msg.content.indexOf('Janusz znajdź:') >= 0) {
        const searchText = msg.content.trim().split(':')[1];
        if (searchText) {
            getWargamingAccountID(msg, searchText);
        }
    }
});

function getJoke(msg) {
    axios.get('https://api.icndb.com/jokes/random')
        .then((response) => {
            msg.reply(response.data.value.joke);
        });
}

function getWargamingAccountID(msg, searchText) {
    axios.get('https://api.worldofwarships.eu/wows/account/list/', { params: { application_id: process.env.WARGAMING_TOKEN, search: searchText } })
        .then((response) => {
            let message = '';
            response.data.data.forEach((element, index) => {
                if (index > 0) {
                    message += ', '
                }
                message += `\`${element.account_id}\` (${element.nickname})`;
            })
            if (message.length > 200) {
                message = message.slice(0, 197) + '... **Podaj dokładniejszy nick aby uzyskać dokładniejszy wynik.**';
            }
            if (!message.length) {
                message = 'Nic nie znalazłem :worried:'
            } else if (response.data.data.length === 1) {
                message += ` -> https://wows-numbers.com/player/${response.data.data[0].account_id},${response.data.data[0].nickname}/`;
            }
            msg.reply(message);
        });
}
