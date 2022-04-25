module.exports = (app) => {
    const {getExpectedStats} = require('../controllers/wnController');
    app.route('/api/wows/pr/expected')
        .get(getExpectedStats)
};
