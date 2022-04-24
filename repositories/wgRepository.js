require('dotenv').config();
const {replaceInText} = require('../helpers');
const axios = require('axios').default;

class WgRepository {
    url = `https://api.worldofwarships.${ process.env.WARGAMING_SERVER || 'eu' }/wows{path}?application_id=${ process.env.WARGAMING_ID }`;

    async fetchAccountStats(searchText, accountId) {
        let user;
        if (!accountId) {
            user = await this.fetchAccounts(searchText, true);
            if (!user) return false;
            if (!user.account_id) return {};
            accountId = user.account_id
        }
        return await axios.get(replaceInText(this.url, '{path}', '/account/info/'), {params: {account_id: accountId}})
            .then((response) => {
                if (response && response.data) {
                    return response.data;
                } else {
                    return false;
                }
            })
            .catch(() => {
                return false;
            });
    }

    async fetchAccounts(searchText, cherryPick = false) {
        return await axios.get(replaceInText(this.url, '{path}', '/account/list/'), {params: {search: searchText}})
            .then((response) => {
                if (response && response.data) {
                    if (cherryPick) return response.data.data[0] || {};
                    return response.data;
                } else {
                    return false;
                }
            })
            .catch(() => {
                return false;
            });
    }

    async fetchClans(searchText) {
        return await axios.get(replaceInText(this.url, '{path}', '/clans/list/'), {params: {search: searchText}})
            .then((response) => {
                if (response && response.data) {
                    return response.data;
                } else {
                    return false;
                }
            })
            .catch(() => {
                return false;
            });
    }

    async fetchWarshipsStats(searchText, accountId) {
        let user;
        if (!accountId) {
            user = await this.fetchAccounts(searchText, true);
            if (!user) return false;
            if (!user.account_id) return {};
            accountId = user.account_id
        }
        return await axios.get(replaceInText(this.url, '{path}', '/ships/stats/'), {params: {account_id: accountId}})
            .then((response) => {
                if (response && response.data) {
                    return response.data;
                } else {
                    return false;
                }
            })
            .catch(() => {
                return false;
            });
    }
}

function createWgRepository() {
    return new WgRepository();
}

module.exports = {createWgRepository};
