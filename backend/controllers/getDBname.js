const { select } = require("framer-motion/client");

function getDbName(req) {
    const selectedStore = req.query.store;

    if (req.user.role === 'admin' || selectedStore) {
        return selectedStore;
    } /*else {
        return req.user.branch;
    }*/
}

module.exports = getDbName;
