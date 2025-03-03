const authorizeAction = (action) => {
    return (req, res, next) => {
        if (action === 'read' && req.method === 'GET') {
            return next(); 
        }

        const { role, branch } = req.user;

        if (role === 'admin') {
            return next();
        }

        if (role === 'branch_user') {
            if (branch === process.env.DB) {
                return next();
            }

            return res.status(403).json({ message: "Unauthorized: You can't edit another user's data." });
        }

        return res.status(403).json({ message: "Forbidden: You don't have permission to perform this action." });
    };
};

module.exports = authorizeAction;
