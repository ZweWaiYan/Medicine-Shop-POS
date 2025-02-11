const db = require('../database')

const Joi = require("joi");
/*
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
*/

async function salereport(req, res) {
    const { saleId, date, subtotal, discount, cashBack, total, amountPaid, remainingBalance, items } = req.body;
    /*const { error } = saleSchema.validate({ saleId, date, subtotal, discount, cashBack, total, amountPaid, remainingBalance, items }, { abortEarly: false });

    if (error) {
        return res.status(400).json({ message: "Invalid input", errors: error.details });
    }*/

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
        console.error("Error processing sale:", error);
        res.status(500).json({ message: "Error processing sale", error });
    }
};

module.exports = {salereport};