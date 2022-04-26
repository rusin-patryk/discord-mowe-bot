const {createWgRepository} = require('../repositories/wgRepository');
const {
    getUserLocale,
    getIconByStat,
    countMaxChars,
    fillWhitespaces,
} = require('../helpers');
const {messages} = require('../constants/messages');
const {createWnService} = require('./wowsNumbersService');

const wgRepository = createWgRepository();
const wnServiceInstance = createWnService();

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
            const colors = await wnServiceInstance.getStatsColors();
            const user = response.data[Object.keys(response.data)[0]];
            const stats = user.statistics.pvp;
            this.getPR(msg, '', user.account_id)
                .then((pr) => {
                    if (pr && colors) {
                        let message = `**${ user.nickname }** -> https://wows-numbers.com/player/${ user.account_id },${ user.nickname }/ `;
                        const s = {
                            pr: pr,
                            winRate: `${ ((stats.wins * 100 / stats.battles) || 0).toFixed(2) }%`,
                            battles: stats.battles,
                            avgFrags: ((stats.frags / stats.battles) || 0).toFixed(2),
                            avgDmg: ((stats.damage_dealt / stats.battles) || 0).toFixed(),
                            avgXP: ((stats.xp / stats.battles) || 0).toFixed(),
                            kdRatio: ((stats.frags / (stats.battles - stats.survived_battles)) || 0).toFixed(2),
                        };
                        const toLength = countMaxChars(s);
                        message += `\n\`${ fillWhitespaces(pr, toLength) }\` ${ getIconByStat(colors, 'rating', pr) } - PR`;
                        message += `\n\`${ fillWhitespaces(s.winRate, toLength) }\` ${ getIconByStat(colors, 'win_rate', (stats.wins * 100 / stats.battles) || 0) } - WR`;
                        message += `\n\`${ fillWhitespaces(s.battles, toLength) }\` ${ getIconByStat(colors, 'battles', s.battles) } - Battles`;
                        message += `\n\`${ fillWhitespaces(s.avgFrags, toLength) }\` ${ getIconByStat(colors, 'average_frags', s.avgFrags) } - Avg Frags`;
                        message += `\n\`${ fillWhitespaces(s.avgDmg, toLength) }\` :white_small_square: - Avg DMG`;
                        message += `\n\`${ fillWhitespaces(s.avgXP, toLength) }\` :white_small_square: - Avg XP`;
                        message += `\n\`${ fillWhitespaces(s.kdRatio, toLength) }\` :white_small_square: - K/D ratio`;
                        msg.reply(message);
                    } else {
                        this.checkWgResponse(msg, false);
                    }
                })
                .catch(() => {
                    this.checkWgResponse(msg, false);
                });
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

    async getPR(msg, searchText, accountId) {
        const shipsStats = await wgRepository.fetchWarshipsStats(searchText, accountId);
        const expectedValues = await wnServiceInstance.getExpectedStats();
        if (this.checkWgResponse(msg, shipsStats) && !!expectedValues) {
            let actualDmg = 0;
            let expectedDmg = 0;
            let actualFrags = 0;
            let expectedFrags = 0;
            let actualWins = 0;
            let expectedWins = 0;
            shipsStats.data[Object.keys(shipsStats.data)[0]].forEach((element) => {
                if (!Array.isArray(expectedValues.data[element.ship_id]) && element.pvp.battles) {
                    const expectedElement = expectedValues.data[element.ship_id];
                    actualDmg += element.pvp.damage_dealt;
                    expectedDmg += expectedElement.average_damage_dealt * element.pvp.battles;
                    actualFrags += element.pvp.frags;
                    expectedFrags += expectedElement.average_frags * element.pvp.battles;
                    actualWins += element.pvp.wins;
                    expectedWins += (expectedElement.win_rate / 100) * element.pvp.battles;
                }
            });
            const rDmg = actualDmg / expectedDmg;
            const rFrags = actualFrags / expectedFrags;
            const rWins = actualWins / expectedWins;
            const nDmg = ((rDmg - 0.4) / 0.6) || 0;
            const nFrags = ((rFrags - 0.1) / 0.9) || 0;
            const nWins = ((rWins - 0.7) / 0.3) || 0;
            return (700 * nDmg + 300 * nFrags + 150 * nWins).toFixed();
        }
        return false;
    }
}

function createWgService() {
    return new WgService();
}

module.exports = {createWgService};
