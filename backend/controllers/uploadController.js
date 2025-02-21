/*const db = require('../database');
const Joi = require('joi');
const xss = require('xss');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;


async function uploaditem(item){
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try{
        const uploads = []
        const values = []

        if (item.hasOwnProperty('item_code')) {
            uploads.push("item_code");
            values.push(item.item_code);
        }
        
        if (item.hasOwnProperty('barcode')) {
            uploads.push("barcode");
            values.push(item.barcode);
        }
        
        if (item.hasOwnProperty('name')) {
            uploads.push("name");
            values.push(item.name);
        }
        
        if (item.hasOwnProperty('category')) {
            uploads.push("category");
            values.push(item.category);
        }
        
        if (item.hasOwnProperty('price')) {
            uploads.push("price");
            values.push(item.price);
        }
        
        if (item.hasOwnProperty('expire_date')) {
            uploads.push("expire_date");
            values.push(item.expire_date);
        }
        
        if (item.hasOwnProperty('alert_date')) {
            uploads.push("alert_date");
            values.push(item.alert_date);
        }
        
        if (item.hasOwnProperty('quantity')) {
            uploads.push("quantity");
            values.push(item.quantity);
        }
        
        if (item.hasOwnProperty('remark')) {
            uploads.push("remark");
            values.push(item.remark);
        }
        
        if (item.hasOwnProperty('image_path')) {
            uploads.push("image_path");
            values.push(item.image_path);
        }
        
        const query = `INSERT INTO items (${uploads.join(', ')}) VALUES (${uploads.map(() => '?').join(', ')})`;
        await db.query(query,values)
        await connection.commit();

    }catch(error){
        console.log(error)
        await connection.rollback();
        if(error.code ==='ER_DUP_ENTRY'){
            if (error.message.includes('item_code')) {
                throw new Error("Item code already exists.");
            } else if (error.message.includes('bar_code')) {
                throw new Error("Barcode already exists.");
            } else {
                throw new Error("Duplicate entry detected.");
            }
        }
        throw new Error(`Failed to upload item: ${error.message}`);
    }finally {
        connection.release();
    }
}

const uploadSchema = Joi.object({
    item_code : Joi.string().pattern(/^[A-Za-z0-9-_]+$/).min(3).max(50).required(),
    barcode : Joi.string().pattern(/^[0-9]+$/).min(8).max(20).required(),
    name : Joi.string().pattern(/^[A-Za-z0-9\-_(),.& ]+$/).min(3).max(50).required(),
    category : Joi.string().pattern(/^[A-Za-z0-9\-_(),.& ]+$/).min(3).max(50).allow(null, ''),
    price : Joi.number().precision(2).positive().required(),
    expire_date :Joi.date().required(),
    alert_date: Joi.date().required(),
    quantity : Joi.number().required(),
    remark : Joi.string().pattern(/^[a-zA-Z0-9\s.,]*$/).allow('').allow(null).optional(),
    image_path : Joi.string().pattern(/^[a-zA-Z0-9\s\-_\/\\.]*$/).min(3).max(500).optional().allow(null, 'null').optional()
})

async function upload(req, res){
    const item_code = req.body.item_code
    const barcode = req.body.barcode
    const name = xss(req.body.name)
    const category = xss(req.body.category)
    const price = req.body.price
    const expire_date = xss(req.body.expire_date)
    const alert_date = xss(req.body.alert_date)
    const quantity = req.body.quantity
    const remark = xss(req.body.remark)
    const image_path = req.file ? `/images/${req.file.filename}` : null;

    try{
        const {error} = uploadSchema.validate({item_code, barcode, name, category, price, expire_date, alert_date, quantity, remark, image_path})
        if(error){
            console.log(error)
            if(req.file){
                await fs.unlink(`./${image_path}`);
            }
            return res.status(400).json({errors: error.details[0].message});
        }

        const item = {
            item_code: item_code,
            barcode: barcode,
            name: name,
            category: category || null,
            price: price,
            expire_date: expire_date || null,
            alert_date: alert_date || null,
            quantity: quantity,
            remark: remark || null,
            image_path: image_path
        }
        
        try {
            await uploaditem(item);
            res.status(201).json({ message: 'Uploaded successfully.', imagePath:image_path });
        } catch (error) {
            console.log(error)
            if(req.file){
                await fs.unlink(`./${image_path}`);
            }
            return res.status(400).json({ message: `Failed to upload item: ${error.message}` });
        }
    } catch (error) {
        console.log(error)
        console.error('Unexpected error:', error.message);
        return res.status(500).json({ message: "Internal server error." });
    }
}

module.exports = {upload}*/


//with mongodb

const { connectDB } = require('../mongodb_connector');
const Joi = require('joi');
const xss = require('xss');
const fs = require('fs').promises;

async function uploaditem(item) {
    const client = await connectDB();
    const database = client.db('storeB');
    const collection = database.collection("items");

    try {
        const existingItem = await collection.findOne({
            $or: [{ item_code: item.item_code }, { barcode: item.barcode }]
        });

        if (existingItem) {
            throw new Error(existingItem.item_code === item.item_code ? "Item code already exists." : "Barcode already exists.");
        }

        const result = await collection.insertOne(item);
        console.log("Inserted Item:", result.insertedId);

    } catch (error) {
        console.error("Insert Error:", error);
        throw new Error(`Failed to upload item: ${error.message}`);
    }
}

const uploadSchema = Joi.object({
    item_code: Joi.string().pattern(/^[A-Za-z0-9-_]+$/).min(3).max(50).required(),
    barcode: Joi.string().pattern(/^[0-9]+$/).min(8).max(20).required(),
    name: Joi.string().pattern(/^[A-Za-z0-9\-_(),.& ]+$/).min(3).max(50).required(),
    category: Joi.string().pattern(/^[A-Za-z0-9\-_(),.& ]+$/).min(3).max(50).allow(null, ''),
    price: Joi.number().precision(2).positive().required(),
    expire_date: Joi.date().required(),
    alert_date: Joi.date().required(),
    quantity: Joi.number().required(),
    remark: Joi.string().pattern(/^[a-zA-Z0-9\s.,]*$/).allow('').allow(null).optional(),
    image_path: Joi.string().pattern(/^[a-zA-Z0-9\s\-_\/\\.]*$/).min(3).max(500).optional().allow(null, 'null').optional()
});

async function upload(req, res) {
    const item_code = req.body.item_code;
    const barcode = req.body.barcode;
    const name = xss(req.body.name);
    const category = xss(req.body.category);
    const price = req.body.price;
    const expire_date = xss(req.body.expire_date);
    const alert_date = xss(req.body.alert_date);
    const quantity = req.body.quantity;
    const remark = xss(req.body.remark);
    const image_path = req.file ? `/images/${req.file.filename}` : null;

    try {
        // Validate the input data
        const { error } = uploadSchema.validate({ item_code, barcode, name, category, price, expire_date, alert_date, quantity, remark, image_path });
        if (error) {
            console.log(error);
            if (req.file) {
                await fs.unlink(`./${image_path}`);
            }
            return res.status(400).json({ errors: error.details[0].message });
        }

        const item = {
            item_code,
            barcode,
            name,
            category: category || null,
            price,
            expire_date: new Date(expire_date),
            alert_date: new Date(alert_date),
            quantity,
            remark: remark || null,
            image_path,
            upload_date: new Date()
        };

        try {
            await uploaditem(item);
            res.status(201).json({ message: 'Uploaded successfully.', imagePath: image_path });
            console.log("SUCCESS!")
        } catch (error) {
            console.log(error);
            if (req.file) {
                await fs.unlink(`./${image_path}`);
            }
            return res.status(400).json({ message: `Failed to upload item: ${error.message}` });
        }
    } catch (error) {
        console.log(error);
        console.error('Unexpected error:', error.message);
        return res.status(500).json({ message: "Internal server error." });
    }
}

module.exports = { upload };
