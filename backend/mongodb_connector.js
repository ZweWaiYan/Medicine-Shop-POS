const { MongoClient } = require("mongodb");

const uri = "";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function connectDB() {
    try {
        if (!client.topology || !client.topology.isConnected()) {
            await client.connect();
            console.log("✅ Connected to MongoDB");
            const databases = await client.db().admin().listDatabases();
            console.log("📂 Databases:", databases);
        }
        //const database = client.db("storeA");
        return client;
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        throw error;
    }
}

module.exports = { connectDB };