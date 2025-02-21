/*const db = require('../database');
const fs = require('fs');
const path = require('path')

async function deleteitem(req, res){
    try{
        const item_id = req.params.item_id;
        const [items] = await db.query(`SELECT image_path FROM items where item_id = ?`,[item_id]);
        if(items.length === 0){
            return res.status(400).json({message:"Item not found."})
        }

        const image_path = items[0].image_path;

        const del_query = `DELETE FROM items where item_id = ?`
        await db.query(del_query,[item_id]);

        const absolute_path = path.join(__dirname,`../${image_path}`);
        await fs.promises.unlink(absolute_path);
        res.json({message:"image deleted successfully."});
    }catch(error){
        return res.status(500).send({message:"Error deleting item."});
    }
}

module.exports = {deleteitem}*/


//with mongodb
const { connectDB } = require('../mongodb_connector');
const fs = require('fs');
const path = require('path');
const { ObjectId } = require('mongodb');

async function deleteitem(req, res) {
    try {
        const client = await connectDB();
        const database = client.db('storeB');
        const itemsCollection = database.collection('items');
        //const itemsCollection = dbInstance.collection('items');

        const itemId = req.params.item_id;

        if (!ObjectId.isValid(itemId)) {
            return res.status(400).json({ message: "Invalid item ID." });
        }

        const item = await itemsCollection.findOne({ _id: new ObjectId(itemId) });
        if (!item) {
            return res.status(400).json({ message: "Item not found." });
        }

        await itemsCollection.deleteOne({ _id: new ObjectId(itemId) });

        if (item.image_path) {
            const absolutePath = path.join(__dirname, `../${item.image_path}`);
            if (fs.existsSync(absolutePath)) {
                await fs.promises.unlink(absolutePath);
            }
        }

        res.json({ message: "Item deleted successfully." });
    } catch (error) {
        console.error("❌ Error deleting item:", error);
        return res.status(500).send({ message: "Error deleting item." });
    }
}

module.exports = { deleteitem };