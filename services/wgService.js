const {getUrl, getUserLocale} = require('../helpers');
const {messages} = require('../constants/messages');

const axios = require('axios').default;

class WgService {
    url = `https://api.worldofwarships.eu/wows{path}?application_id=${process.env.WARGAMING_TOKEN}`;

    getWgAccounts(msg, searchText) {
        axios.get(getUrl(this.url, '/account/list/'), { params: { search: searchText } })
            .then((response) => {
                let message = '';
                if (!response.data.data.length) {
                    message = `${messages[getUserLocale(msg)].NOT_FOUND} :worried:`;
                } else if (response.data.data.length === 1) {
                    message = `${response.data.data[0].nickname} (\`${response.data.data[0].account_id}\`) -> https://wows-numbers.com/player/${response.data.data[0].account_id},${response.data.data[0].nickname}/`;
                } else {
                    response.data.data.forEach((element, index) => {
                        if (index > 0) {
                            message += ', '
                        }
                        message += element.nickname;
                    })
                    if (message.length > 200) {
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
