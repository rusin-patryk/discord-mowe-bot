const {createWnService} = require('../../services/wowsNumbersService');
const wnServiceInstance = createWnService();

async function getExpectedStats(_req, res) {
    res.setHeader("Content-Type", "application/json");
    const expectedValues = await wnServiceInstance.getExpectedStats();
    if (!!expectedValues) {
        return res.status(200).json(expectedValues);
    }
    return res.status(500).json(false);
}

module.exports = {getExpectedStats};
