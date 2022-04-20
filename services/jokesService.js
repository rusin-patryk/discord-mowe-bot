const axios = require('axios').default;

class JokeService {
    getRandomJoke(msg) {
        axios.get('https://api.icndb.com/jokes/random')
            .then((response) => {
                msg.reply(response.data.value.joke);
            });
    }
}

function createJokeService() {
    return new JokeService();
}

module.exports = { createJokeService };
