const { MongoClient } = require("mongodb");
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@pharmacydb.809xe.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.DB}`

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function connectDB() {
    try {
        if (!client.topology || !client.topology.isConnected()) {
            await client.connect();
            console.log("✅ Connected to MongoDB");
            //const databases = await client.db().admin().listDatabases();
            //console.log("📂 Databases:", databases);
            const admindb = client.db('admin')
            const userinfo =await admindb.command({ usersInfo: process.env.DBUSER })
            current_user_roles = userinfo.users;
            console.log(current_user_roles);
            console.log(current_user_roles.some(role => role.role === 'atlasAdmin' && role.db === 'admin'))

        }
        return client;
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        throw error;
    }
}

module.exports = { connectDB };