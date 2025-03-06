const getDbName = require('../controllers/getDBname');
const getRole = require('../controllers/getRole');
const authorizeAction = (action) => {

    return (req, res, next) => {


        if (action === 'read' && req.method === 'GET') {
            return next(); 
        }

        getRole()
            .then(roleInfo => console.log(roleInfo))
            .catch(error => console.error('Failed to get role:', error));
        const { role, branch } = req.user;
        

        if (role === 'admin') {
            return next();
        }

        if (branch === getDbName(req)) {
            return next();
        }
        return res.status(403).json({ message: "Forbidden: You don't have permission to perform this action." });
    };
};

module.exports = authorizeAction;
