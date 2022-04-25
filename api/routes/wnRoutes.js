module.exports = (app) => {
    const {getExpectedStats} = require('../controllers/wnController');
    app.route('/wows/pr/expected')
        .get(getExpectedStats)
};
