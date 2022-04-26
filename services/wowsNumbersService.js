const {createWnRepository} = require('../repositories/wowsNumbersRepository')

const wnRepository = createWnRepository();

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
        response = await wnRepository.fetchStatsColors();
        if (response) {
            this.createCacheObj('colors', response);
            return response;
        } else {
            return false
        }
    }

    async getExpectedStats() {
        let response = this.getFromCache('expected');
        if (response) return response;
        response = await wnRepository.fetchExpectedStats();
        if (response) {
            this.createCacheObj('server', response);
            return response;
        } else {
            return false
        }
    }
}

let wnInstance = undefined;

function createWnService() {
    if (!wnInstance) {
        wnInstance = new WnService();
        wnInstance.init();
    }
    return wnInstance;
}

module.exports = {createWnService};
