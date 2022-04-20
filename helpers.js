const {commands} = require('./commands');

function normalizeRequest(request) {
    return request.toLowerCase()
        .replace(`${process.env.BOT_NAME.toLowerCase()} `, '')
        .replace('ą', 'a')
        .replace('ć', 'c')
        .replace('ę', 'e')
        .replace('ł', 'l')
        .replace('ń', 'n')
        .replace('ó', 'o')
        .replace('ś', 's')
        .replace('ź', 'z')
        .replace('ż', 'z')
}

function getUrl(url, path) {
    return url.replace('{path}', path);
}

function getCommand(message, key) {
    message = normalizeRequest(message);
    if (commands[key]) {
        if (commands[key].includes(message.split(':')[0])) {
            if (message.trim().split(':').length === 2) {
                return message.trim().split(':')[1]
            }
            return true
        }
    }
    return false;
}

module.exports = { getUrl, getCommand };
