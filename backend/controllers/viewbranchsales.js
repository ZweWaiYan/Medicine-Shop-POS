const { MongoClient } = require('mongodb');
const { connectDB } = require('../mongodb_connector');

async function viewbranchsales(req, res) {
    try {
        const store = req.params.store;
        const client = await connectDB();
        const database = client.db(store);
        const salesCollection = database.collection('sales');
        const salesData = await salesCollection.find({}).toArray();
        
        res.json(salesData);
    } catch (error) {
        console.error('Error fetching sales report:', error);
        res.status(500).json({ message: 'Error fetching sales report' });
    }
}

async function saledetails(req, res){
    const store = req.params.store;
    const saleId = req.params.saleId;
    const database = client.db(store)
    const salesCollection = database.collection('sales');

    if (!ObjectId.isValid(saleId)) {
        return res.status(400).json({ message: "Invalid sale ID format" });
    }

    try {
        const sale = await salesCollection.findOne({ _id: new ObjectId(saleId) });

        if (!sale) {
            return res.status(404).json({ message: "No sale record found!" });
        }

        res.json(sale);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching sale record" });
    }




}

module.exports = { viewbranchsales, saledetails };