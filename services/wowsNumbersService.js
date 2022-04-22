const axios = require('axios').default;

class WnService {
    cache = new Map();

    init() {
        this.getStatsColors();
        this.getExpectedStats();
    }

    createCacheObj(key, data) {
        const obj = {
            data: data,
            expired: Date.now() + 86400000,
        }
        this.cache.set(key, obj);
    }

    getFromCache(key) {
        if (this.cache.has(key)) {
            if (this.cache.get(key).expired > Date.now()) {
                return this.cache.get(key).data;
            }
        }
        return false;
    }

    async getStatsColors() {
        let response = this.getFromCache('colors');
        if (response) return response;
        response = await axios.get('https://wows-numbers.com/colors/json');
        this.createCacheObj('colors', response.data);
        return response.data;
    }

    async getExpectedStats() {
        let response = this.getFromCache('expected');
        if (response) return response;
        response = await axios.get('https://api.wows-numbers.com/personal/rating/expected/json/');
        this.createCacheObj('server', response.data);
        return response.data;
    }
}

function createWnService() {
    return new WnService();
}

module.exports = {createWnService};
