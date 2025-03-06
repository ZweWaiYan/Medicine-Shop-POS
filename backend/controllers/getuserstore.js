const jwt = require('jsonwebtoken');

const getUserStore = (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const storeData = user.role === "admin" ? "storeA" : user.branch;
        
        res.json({ storeData });
    } catch (error) {
        console.error("Error fetching store data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { getUserStore };
