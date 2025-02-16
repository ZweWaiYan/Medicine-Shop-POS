const db = require('../database')

const Joi = require("joi");

const saleSchema = Joi.object({
    saleId: Joi.string().required(),
    date: Joi.date().iso().required(),
    subtotal: Joi.number().integer().min(0).required(),
    discount: Joi.number().integer().min(0).default(0),
    cashBack: Joi.number().integer().min(0).default(0),
    total: Joi.number().integer().min(0).required(),
    amountPaid: Joi.number().integer().min(0).required(),
    remainingBalance: Joi.number().integer().min(0).default(0),

    items: Joi.array().items(
        Joi.object({
            item_code: Joi.string().allow(null, ""),
            barcode: Joi.string().allow(null, ""),
            name: Joi.string().required(),
            price: Joi.number().integer().min(0).required(),
            quantity: Joi.number().integer().min(1).required(),
        })
    ).min(1).required(),
});


async function addsale(req, res) {
    const { saleId, date, subtotal, discount, cashBack, total, amountPaid, remainingBalance, items } = req.body;
    const { error } = saleSchema.validate({ saleId, date, subtotal, discount, cashBack, total, amountPaid, remainingBalance, items }, { abortEarly: false });

    if (error) {
        console.log(error)
        return res.status(400).json({ message: "Invalid input", errors: error.details });
    }

    try {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        await connection.query(
            "INSERT INTO sales (sale_id, date, subtotal, discount, cash_back, total, amount_paid, remaining_balance) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [saleId, date, subtotal, discount, cashBack, total, amountPaid, remainingBalance]
        );

        for (const item of items) {
            await connection.query(
                "INSERT INTO sale_items (sale_id, item_code, barcode, name, price, quantity, total) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [saleId, item.item_code || null, item.barcode || null, item.name, item.price, item.quantity, item.price * item.quantity]
            );

            await connection.query(
                "UPDATE items SET quantity = GREATEST(quantity - ?, 0) WHERE item_code = ? OR barcode = ?",
                [item.quantity, item.item_code, item.barcode]
            );
        }

        await connection.commit();
        res.status(201).json({ message: "Sale recorded successfully" });

    } catch (error) {
        await connection.rollback();
        console.error("Error processing sale:", error);
        res.status(500).json({ message: "Error processing sale", error });
    }
};

const updateSchema = Joi.object({
    saleId: Joi.string().allow(null, ""),
    subtotal: Joi.number().integer().min(0).allow(null, ""),
    discount: Joi.number().integer().min(0).default(0),
    cashBack: Joi.number().integer().min(0).default(0),
    total: Joi.number().integer().min(0).allow(null, ""),
    amountPaid: Joi.number().integer().min(0).allow(null, ""),
    remainingBalance: Joi.number().integer().min(0).default(0),

    items: Joi.array().items(
        Joi.object({
            item_code: Joi.string().allow(null, ""),
            barcode: Joi.string().allow(null, ""),
            name: Joi.string().allow(null, ""),
            price: Joi.number().integer().min(0).allow(null, ""),
            quantity: Joi.number().integer().min(1).allow(null, ""),
        })
    ).min(1).allow(null, ""),
});

async function updatesale(req,res){
    const { saleId } = req.params;
    const { subtotal, discount, cashBack, total, amountPaid, remainingBalance, items } = req.body;
    const { error } = updateSchema.validate({ saleId, subtotal, discount, cashBack, total, amountPaid, remainingBalance, items }, { abortEarly: false });
    try{
        const connection = await db.getConnection();
        await connection.beginTransaction();
        await connection.query(`
            UPDATE sales 
            SET subtotal = ?, discount = ?, cash_back = ?, total = ?, amount_paid = ?, remaining_balance = ?
            WHERE sale_id = ?`,
            [subtotal, discount, cashBack, total, amountPaid, remainingBalance, saleId]
        );

        for (const item of items) {
            await connection.query(
                `UPDATE sale_items 
                 SET barcode = ?, name = ?, price = ?, quantity = ?, total = ?
                 WHERE sale_id = ? AND item_code = ?`,
                [item.barcode, item.name, item.price, item.quantity, item.total, saleId, item.item_code]
            );
        }

        await connection.commit();
        res.json({ message: "Sale updated successfully" });


    }catch (error) {
        await connection.rollback();
        console.error("Error updating sale:", error);
        res.status(500).json({ message: "Error updating sale", error });
    } finally {
        connection.release();
    }
}

async function deletesale(req,res){
    const sale_id = req.params.sale_id;
    try{
        await db.query(`DELETE FROM sales WHERE sale_id = ?`,[sale_id]);
        await db.query(`DELETE FROM sale_items where sale_id = ?`,[sale_id]);
        res.json({message:"Sale Record deleted successfully."});
    }catch(error){
        console.error(error);
        res.status(500).json({message:"Internal server error."})
    }
}


//fetch sale by sale_id
async function fetchsalebyId(req,res){
    const sale_id = req.params.sale_id;
    try{
        const [sales] = await db.query(`SELECT * from sales where sale_id = ?`,[sale_id]);

        if (sales.length === 0) {
            return res.status(404).json({ message: "No sale record found!" });
        }
        const [items] = await db.query(`SELECT * from sale_items where sale_id = ?`,[sale_id]);
        res.json({ sale: sales[0], items });
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Error fetching item sale record."});
    }
}


//fetch all sales
async function fetchsales(req,res){
    try{
        const [sales] = await db.query(`select * from sales`);
        if(sales.length === 0){
            return res.status(404).json({message:"No sale record found!"});
        }
        res.json(sales);
    }catch(error){
        console.error(error);
        return res.status(500).json({message:"Error fetching sale records."})
    }
}
module.exports = {
    addsale,
    updatesale,
    deletesale,
    fetchsalebyId,
    fetchsales
};