const { ObjectId } = require("mongodb");
const { connectDB } = require('../mongodb_connector');
const Joi = require("joi");
require('dotenv').config();
const db = process.env.DB
const getDbName = require('./getDBname');

// Validation schema
const saleSchema = Joi.object({
    saleId: Joi.string().required(),
    date: Joi.date().iso().required(),
    subtotal: Joi.number().integer().min(0).required(),
    discount: Joi.number().integer().min(0).default(0),
    cashBack: Joi.number().integer().min(0).default(0),
    total: Joi.number().integer().min(0).required(),
    amountPaid: Joi.number().integer().min(0).required(),
    remainingBalance: Joi.number().integer().min(0).default(0),
    items: Joi.array()
        .items(
            Joi.object({
                item_code: Joi.string().allow(null, ""),
                barcode: Joi.string().allow(null, ""),
                name: Joi.string().required(),
                price: Joi.number().integer().min(0).required(),
                quantity: Joi.number().integer().min(1).required(),
            })
        )
        .min(1)
        .required(),
});

// Add sale
async function addsale(req, res) {
    const client = await connectDB();
    const dbName = getDbName(req);
    const database = client.db(dbName);
    const salesCollection = database.collection("sales");

    const { saleId, date, subtotal, discount, cashBack, total, amountPaid, remainingBalance, items } = req.body;
    const { error } = saleSchema.validate({saleId, date, subtotal, discount, cashBack, total, amountPaid, remainingBalance, items });

    if (error) {
        console.log(error)
        return res.status(400).json({ message: "Invalid input", errors: error.details });
    }

    try {
        // Insert sale into MongoDB
        const sale = { saleId, date, subtotal, discount, cashBack, total, amountPaid, remainingBalance, items };
        const result = await salesCollection.insertOne(sale);

        res.status(201).json({ message: "Sale recorded successfully", saleId: result.insertedId });
    } catch (error) {
        console.error("Error processing sale:", error);
        if (error.code === 8000) {
            return res.status(403).send({ message: "You dont have permission on this database." });
        }
        res.status(500).json({ message: "Error processing sale", error });
    }
}

// Update sale
async function updatesale(req, res) {
    const client = await connectDB();
    const dbName = getDbName(req);
    const database = client.db(dbName);
    const salesCollection = database.collection("sales");

    const { saleId } = req.params;
    if (!ObjectId.isValid(saleId)) {
        return res.status(400).json({ message: "Invalid sale ID format" });
    }

    const updateFields = req.body;
    delete updateFields.saleId;

    try {
        const result = await salesCollection.updateOne(
            { _id: new ObjectId(saleId) },
            { $set: updateFields }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Sale not found" });
        }

        res.json({ message: "Sale updated successfully" });
    } catch (error) {
        console.error("Error updating sale:", error);
        res.status(500).json({ message: "Error updating sale", error });
    }
}

// Delete sale
async function deletesale(req, res) {
    const client = await connectDB();
    const dbName = getDbName(req);
    const database = client.db(dbName);
    const salesCollection = database.collection("sales");

    const { saleId } = req.params;
    if (!ObjectId.isValid(saleId)) {
        return res.status(400).json({ message: "Invalid sale ID format" });
    }

    try {
        const result = await salesCollection.deleteOne({ _id: new ObjectId(saleId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Sale not found" });
        }

        res.json({ message: "Sale record deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Fetch sale by ID
async function fetchsalebyId(req, res) {
    const client = await connectDB();
    const dbName = getDbName(req);
    const database = client.db(dbName);
    const salesCollection = database.collection("sales");

    const { saleId } = req.params;
/*
    if (!ObjectId.isValid(saleId)) {
        console.log('error')
        return res.status(400).json({ message: "Invalid sale ID format" });
    }*/

    try {
        const sale = await salesCollection.findOne({ saleId: saleId });


        if (!sale) {
            return res.status(404).json({ message: "No sale record found!" });
        }

        res.json(sale);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching sale record" });
    }
}

// Fetch all sales
async function fetchsales(req, res) {
    const client = await connectDB();
    const dbName = getDbName(req);
    const database = client.db(dbName);
    const salesCollection = database.collection("sales");

    try {
        const sales = await salesCollection.find().toArray();

        if (sales.length === 0) {
            return res.status(404).json({ message: "No sale records found!" });
        }

        res.json(sales);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching sale records" });
    }
}

module.exports = {
    addsale,
    updatesale,
    deletesale,
    fetchsalebyId,
    fetchsales,
};