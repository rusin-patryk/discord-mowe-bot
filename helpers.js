const {commands} = require('./constants/commands');
const {messages} = require('./constants/messages');

function normalizeRequest(request) {
    return request.toLowerCase()
        .replace(`${ process.env.BOT_NAME.toLowerCase() } `, '')
        .replace('ą', 'a')
        .replace('ć', 'c')
        .replace('ę', 'e')
        .replace('ł', 'l')
        .replace('ń', 'n')
        .replace('ó', 'o')
        .replace('ś', 's')
        .replace('ź', 'z')
        .replace('ż', 'z');
}

function replaceInText(text, search, replace) {
    if (Array.isArray(search)) {
        search.forEach((element, index) => {
            let replaceEl = replace;
            if (Array.isArray(replace)) replaceEl = replace[index];
            text = text.replace(element, replaceEl)
        })
    } else {
        return text.replace(search, replace);
    }
    return text;
}

function getCommand(message, key) {
    message = normalizeRequest(message);
    if (commands[key]) {
        if (commands[key].includes(message.split(':')[0])) {
            if (message.split(':').length === 2) {
                return message.split(':')[1].trim().slice(0, 23);
            }
            return true;
        }
    }
    return false;
}

function getUserLocale(msg) {
    if (msg.member && msg.member.guild && msg.member.guild.preferredLocale) {
        if (messages[msg.member.guild.preferredLocale]) {
            return msg.member.guild.preferredLocale.split('-')[0].toLowerCase();
        }
    }
    return 'en';
}

function getColorValue(colors, key, color) {
    if (!colors || !colors[key]) {
        return 'error';
    }
    return colors[key].find((element) => {
        return element.color === color;
    }).value || 'error';
}

function getIconByStat(colors, key, value) {
    if (!colors || !colors[key]) {
        return 'error';
    }
    let currentColor = '#FE0E00';
    for (let i = 0; i < colors[key].length; i++) {
        if (typeof colors[key][i].value === 'string') {
            colors[key][i].value = parseFloat(colors[key][i].value);
        }
        if (colors[key][i].value > value) {
            currentColor = colors[key][i].color;
            break;
        }
    }
    return getIconByColor(currentColor);
}

function getIconByColor(color) {
    switch (color) {
        case '#FE0E00':
            return ':red_circle:';
        case '#FE7903':
            return ':orange_circle:';
        case '#FFC71F':
            return ':yellow_circle:';
        case '#44B300':
            return ':green_circle:';
        case '#318000':
            return ':green_square:';
        case '#02C9B3':
            return ':blue_circle:';
        case '#D042F3':
            return ':purple_circle:';
        case '#A00DC5':
            return ':purple_square:';
        default:
            return ''
    }
}

function countMaxChars(value) {
    let maxChars = 0;
    if (typeof value === 'object' && !Array.isArray(value)) {
        Object.keys(value).forEach((element) => {
            if (value[element].toString().length > maxChars) {
                maxChars = value[element].toString().length;
            }
        })
    } else if (typeof value === 'object') {
        value.forEach((element) => {
            if (element.toString().length > maxChars) {
                maxChars = element.toString().length;
            }
        })
    } else if (value) {
        maxChars = maxChars.toString().length;
    }
    return maxChars;
}

function fillWhitespaces(value, toLength) {
    value = value.toString();
    if (value.length < toLength) {
        let whitespaces = '';
        for (let i = 0; i < toLength -value.length; i++) {
            whitespaces += ' ';
        }
        value = whitespaces + value;
    }
    return value;
}

module.exports = {
    replaceInText,
    getCommand,
    getUserLocale,
    getColorValue,
    getIconByStat,
    countMaxChars,
    fillWhitespaces
};
