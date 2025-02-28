const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://shopB_owner:shopB_owner123@pharmacydb.809xe.mongodb.net/?retryWrites=true&w=majority&appName=storeB";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function connectDB() {
    try {
        if (!client.topology || !client.topology.isConnected()) {
            await client.connect();
            console.log("✅ Connected to MongoDB");
            const databases = await client.db().admin().listDatabases();
            //console.log("📂 Databases:", databases);
        }
        //const database = client.db("storeB");
        return client;
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        throw error;
    }
}

module.exports = { connectDB };