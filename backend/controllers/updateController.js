const db = require('../database');
const Joi = require('joi');
const xss = require('xss');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

async function updateitem(item){
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try{
        const updates = []
        const values = []

        if (item.item_code) {
            updates.push("item_code = ?");
            values.push(item.item_code);
        }
        if (item.barcode) {
            updates.push("barcode = ?");
            values.push(item.barcode);
        }
        if (item.name) {
            updates.push("name = ?");
            values.push(item.name);
        }
        if (item.category) {
            updates.push("category = ?");
            values.push(item.category);
        }
        if (item.price) {
            updates.push("price = ?");
            values.push(item.price);
        }
        if (item.expire_date) {
            updates.push("expire_date = ?");
            values.push(item.expire_date);
        }
        if (item.alert_date) {
            updates.push("alert_date = ?");
            values.push(item.alert_date);
        }
        if (item.quantity) {
            updates.push("quantity = ?");
            values.push(item.quantity);
        }
        if (item.remark) {
            updates.push("remark = ?");
            values.push(item.remark);
        }
        if (item.image_path) {
            updates.push("image_path = ?");
            values.push(item.image_path);
        }
        
        if (!item.hasOwnProperty("item_id")) {
            throw new Error("Missing item_id for update.");
        }
        
        values.push(item.item_id);
        
        const query = `UPDATE items SET ${updates.join(", ")} WHERE item_id = ?`;

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
        throw new Error(`Failed to update item: ${error.message}`);
    }finally {
        connection.release();
    }

}

const updateSchema = Joi.object({
    item_code : Joi.string().pattern(/^[A-Za-z0-9-_]+$/).min(3).max(50).allow('').allow(null).optional(),
    barcode : Joi.string().pattern(/^[0-9]+$/).min(8).max(20).allow('').allow(null).optional(),
    name : Joi.string().pattern(/^[A-Za-z0-9\-_(),.& ]+$/).min(3).max(50).allow('').allow(null).optional(),
    category : Joi.string().pattern(/^[A-Za-z0-9\-_(),& ]+$/).min(3).max(50).allow('').allow(null).optional()
        .messages({"string.pattern.base": "Category can only contain letters, numbers, spaces, and these symbols: - _ ( ) , &"}),
    price : Joi.number().precision(2).positive().allow('').allow(null).optional(),
    expire_date: Joi.date().required(),
    alert_date: Joi.date().required(),
    quantity : Joi.number().allow('').allow(null).optional(),
    remark : Joi.string().pattern(/^[a-zA-Z0-9\s.,]*$/).allow('').allow(null).optional(),
    image_path : Joi.string().pattern(/^[a-zA-Z0-9\s\-_\/\\.]*$/).min(3).max(500).optional().allow(null, 'null').optional()
})

async function update(req, res){
    const {item_id} = req.params
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
    const file = req.file;

    try{
        const {error} = updateSchema.validate({item_code, barcode, name, category, price, expire_date, alert_date, quantity, remark, image_path})
        if(error){
            if(req.file){
                await fs.promises.unlink(`./${image_path}`);
            }
            console.log(error)
            return res.status(400).json({errors: error.details[0].message});
        }

        const item = {
            item_id: item_id,
            item_code: item_code,
            barcode: barcode,
            name: name,
            category: category || null,
            price: price,
            expire_date: expire_date,
            alert_date: alert_date,
            quantity: quantity,
            remark: remark || null,
            image_path: image_path
        }

        if (file) {
            const [existingItem] = await db.query('SELECT image_path FROM items WHERE item_id = ?', [item_id]);
            const oldImagePath = existingItem[0].image_path;

            if (oldImagePath) {
                const oldImageFilePath = path.join(__dirname, `../${oldImagePath}`);
                if (fs.existsSync(oldImageFilePath)) {
                    await fs.promises.unlink(oldImageFilePath);
                }
            }
        }

        try {
            await updateitem(item);
            res.status(201).json({ message: 'Uploaded successfully.'});
        } catch (error) {
            console.log(error)
            if(req.file){
                await fs.promises.unlink(`./${image_path}`);
            }
            return res.status(400).json({ message: `Failed to upload item: ${error.message}` });
        }
    } catch (error) {
        console.log(error)
        console.error('Unexpected error:', error.message);
        return res.status(500).json({ message: "Internal server error." });
    }
}

module.exports = {update}