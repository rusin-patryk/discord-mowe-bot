const {createWgRepository} = require('../repositories/wgRepository');
const {createWnService} = require('./wowsNumbersService');
const {getUserLocale, getIconByStat} = require('../helpers');
const {messages} = require('../constants/messages');

const wgRepository = createWgRepository();

const wowsNnService = createWnService();
wowsNnService.init();

class WgService {
    checkWgResponse(msg, response) {
        if (!response) {
            msg.reply(`${ messages[getUserLocale(msg)].API_ERROR } :face_exhaling:`);
            return false;
        } else if (response.status !== 'ok') {
            msg.reply(`${ messages[getUserLocale(msg)].BAD_REQUEST } :smirk:`);
            return false;
        } else if (response.data && (!response.data.length && !Object.keys(response.data).length)) {
            msg.reply(`${ messages[getUserLocale(msg)].NOT_FOUND } :worried:`);
            return false;
        }
        return true;
    }

    async getAccountStats(msg, searchText) {
        const response = await wgRepository.fetchAccountStats(searchText);
        if (this.checkWgResponse(msg, response)) {
            const colors = await wowsNnService.getStatsColors();
            if (colors) {
                const user = response.data[Object.keys(response.data)[0]];
                const stats = user.statistics.pvp;
                let message = `**${ user.nickname }** -> https://wows-numbers.com/player/${ user.account_id },${ user.nickname }/ `;
                message += `\nPR: \`${ 'TODO' }\``;
                message += `\n${ getIconByStat(colors, 'win_rate', stats.wins * 100 / stats.battles) } WR: \`${ ((stats.wins * 100 / stats.battles) || 0).toFixed(2) }%\``;
                message += `\n${ getIconByStat(colors, 'battles', stats.battles) } Battles: \`${ stats.battles }\``;
                message += `\n${ getIconByStat(colors, 'average_frags', stats.frags / stats.battles) } Avg Frags: \`${ ((stats.frags / stats.battles) || 0).toFixed(2) }\``;
                message += `\nAvg DMG: \`${ ((stats.damage_dealt / stats.battles) || 0).toFixed() }\``;
                message += `\nAvg XP: \`${ ((stats.xp / stats.battles) || 0).toFixed() }\``;
                message += `\nK/D ratio: \`${ ((stats.frags / (stats.battles - stats.survived_battles)) || 0).toFixed(2) }\``;
                msg.reply(message);
            } else {
                this.checkWgResponse(msg, false);
            }
        }
    }

    async getAccounts(msg, searchText) {
        const response = await wgRepository.fetchAccounts(searchText);
        if (this.checkWgResponse(msg, response)) {
            let message = '';
            if (response.data && response.data.length === 1) {
                message = `${ response.data[0].nickname } (\`${ response.data[0].account_id }\`) -> https://wows-numbers.com/player/${ response.data[0].account_id },${ response.data[0].nickname }/`;
            } else if (response.data && response.data.length) {
                response.data.forEach((element, index) => {
                    if (index > 0) {
                        message += ', ';
                    }
                    message += element.nickname;
                });
                if (message.length > 300) {
                    message = message.slice(0, 197) + `... *${ messages[getUserLocale(msg)].TOO_MANY_RESULTS }.*`;
                }
            }
            msg.reply(message);
        }
    }

    async getClans(msg, searchText) {
        const response = await wgRepository.fetchClans(searchText);
        if (this.checkWgResponse(msg, response)) {
            let message = '';
            if (response.data && response.data.length === 1) {
                message = `[${ response.data[0].tag }] ${ response.data[0].name } `;
                message += `-> https://wows-numbers.com/clan/${ response.data[0].clan_id },${ response.data[0].tag }-${ response.data[0].name.replace(/ /g, '-') }/`;
            } else if (response.data && response.data.length) {
                response.data.forEach((element, index) => {
                    if (index > 0) {
                        message += ', ';
                    }
                    message += `[${ element.tag }] ${ element.name }`;
                });
                if (message.length > 400) {
                    message = message.slice(0, 197) + `... *${ messages[getUserLocale(msg)].TOO_MANY_RESULTS }.*`;
                }
            }
            msg.reply(message);
        }
    }
}

function createWgService() {
    return new WgService();
}

module.exports = {createWgService};
