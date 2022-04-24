const axios = require('axios').default;
const {replaceInText} = require('../helpers');

class WnRepository {
    url = 'https://{prefix}wows-numbers.com{path}'

    async fetchStatsColors() {
        return await axios.get(replaceInText(this.url, ['{prefix}', '{path}'], ['', '/colors/json/']))
            .then((response) => {
                if (response && response.data) {
                    return response.data;
                } else {
                    return false;
                }
            })
            .catch(() => {
                return false;
            })
    }

    async fetchExpectedStats() {
        return await axios.get(replaceInText(this.url, ['{prefix}', '{path}'], ['api.', '/personal/rating/expected/json/']))
            .then((response) => {
                if (response && response.data) {
                    return response.data;
                } else {
                    return false;
                }
            })
            .catch(() => {
                return false;
            })
    }
}

function createWnRepository() {
    return new WnRepository();
}

module.exports = {createWnRepository};
