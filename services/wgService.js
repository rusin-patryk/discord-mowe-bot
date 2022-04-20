const {getUrl, getUserLocale} = require('../helpers');
const {messages} = require('../constants/messages');

const axios = require('axios').default;

class WgService {
    url = `https://api.worldofwarships.eu/wows{path}?application_id=${process.env.WARGAMING_TOKEN}`;

    checkResponse(msg, response) {
        if (response.data.status !== 'ok') {
            msg.reply(`${messages[getUserLocale(msg)].BAD_REQUEST} :smirk:`);
            return false;
        } else if (response.data.data && !response.data.data.length) {
            msg.reply(`${messages[getUserLocale(msg)].NOT_FOUND} :worried:`);
            return false;
        }
        return true
    }

    getWgAccounts(msg, searchText) {
        axios.get(getUrl(this.url, '/account/list/'), { params: { search: searchText } })
            .then((response) => {
                if (!this.checkResponse(msg, response)) return;
                let message = '';
                if (response.data.data && response.data.data.length === 1) {
                    message = `${response.data.data[0].nickname} (\`${response.data.data[0].account_id}\`) -> https://wows-numbers.com/player/${response.data.data[0].account_id},${response.data.data[0].nickname}/`;
                } else if (response.data.data && response.data.data.length) {
                    response.data.data.forEach((element, index) => {
                        if (index > 0) {
                            message += ', '
                        }
                        message += element.nickname;
                    })
                    if (message.length > 300) {
                        message = message.slice(0, 197) + `... *${messages[getUserLocale(msg)].TOO_MANY_RESULTS}.*`;
                    }
                }

                msg.reply(message);
            });
    }

    getWgClans(msg, searchText) {
        axios.get(getUrl(this.url, '/clans/list/'), { params: { search: searchText } })
            .then((response) => {
                console.log(response);
                if (!this.checkResponse(msg, response)) return;
                let message = '';
                if (response.data.data && response.data.data.length === 1) {
                    message = `[${response.data.data[0].tag}] ${response.data.data[0].name} -> https://wows-numbers.com/clan/${response.data.data[0].clan_id},${response.data.data[0].tag}-${response.data.data[0].name.replace(/ /g,'-')}/`;
                } else if (response.data.data && response.data.data.length) {
                    response.data.data.forEach((element, index) => {
                        if (index > 0) {
                            message += ', '
                        }
                        message += `[${element.tag}] ${element.name}`;
                    })
                    if (message.length > 400) {
                        message = message.slice(0, 197) + `... *${messages[getUserLocale(msg)].TOO_MANY_RESULTS}.*`;
                    }
                }

                msg.reply(message);
            });
    }
}

function createWgService() {
    return new WgService();
}

module.exports = { createWgService };
