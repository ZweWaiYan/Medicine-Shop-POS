/*const { all } = require('axios');
const db = require('../database');
//SELECT *, CASE WHEN expire_date < CURDATE() THEN 1 ELSE 0 END AS is_expired FROM items
async function allItems(req, res){
    const query = `
            SELECT *, 
                DATE_FORMAT(expire_date, '%Y-%m-%d') AS expire_date, 
                DATE_FORMAT(alert_date, '%Y-%m-%d') AS alert_date,
                CASE WHEN expire_date <= CURDATE() THEN 1 ELSE 0 END AS is_expired,
                CASE WHEN CURDATE() >= COALESCE(alert_date, '9999-12-31') AND current_date < expire_date THEN 1 ELSE 0 END AS is_alerted
            FROM items;
    `;
    try{
        const[allitems]=await db.query(query);
        if(allitems.length === 0){
            return res.status(400).json({message:"No item found."});
        }
        console.log('expire_date:',allitems[0].expire_date,allitems[0].name)
        res.json(allitems)
    }catch(error){
        console.log(error)
        return res.status(500).send({message:'Internal Server Error'});
    }
}

module.exports = {allItems};*/


//with mongo
/*const { all } = require('axios');
const db = require('../database');
//SELECT *, CASE WHEN expire_date < CURDATE() THEN 1 ELSE 0 END AS is_expired FROM items
async function allItems(req, res){
    const query = `
            SELECT *, 
                DATE_FORMAT(expire_date, '%Y-%m-%d') AS expire_date, 
                DATE_FORMAT(alert_date, '%Y-%m-%d') AS alert_date,
                CASE WHEN expire_date <= CURDATE() THEN 1 ELSE 0 END AS is_expired,
                CASE WHEN CURDATE() >= COALESCE(alert_date, '9999-12-31') AND current_date < expire_date THEN 1 ELSE 0 END AS is_alerted
            FROM items;
    `;
    try{
        const[allitems]=await db.query(query);
        if(allitems.length === 0){
            return res.status(400).json({message:"No item found."});
        }
        console.log('expire_date:',allitems[0].expire_date,allitems[0].name)
        res.json(allitems)
    }catch(error){
        console.log(error)
        return res.status(500).send({message:'Internal Server Error'});
    }
}

module.exports = {allItems};*/


//with mongo
const { connectDB } = require('../mongodb_connector');
const { ObjectId } = require('mongodb');
require('dotenv').config();
const getDbName = require('./getDBname');

async function allItems(req, res) {
    const client = await connectDB();
    
    try {
        //console.log(req.user.role)
        if (!req.user && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized access." });
        }
        /*
        let dbName;
        if(req.user.role !== 'admin'){
             dbName = req.user.branch;
        }else{
            dbName = process.env.DB;
        }*/
       
        const dbName = getDbName(req);
        //console.log('dbname: ', dbName);
        
        const database = client.db(dbName);
        const collection = database.collection('items');
        const currentDate = new Date();
        const allitems = await collection.find({}).toArray();

        const formattedItems = allitems.map(item => {
            const expireDate = item.expire_date ? new Date(item.expire_date) : null;
            const alertDate = item.alert_date ? new Date(item.alert_date) : null;

            return {
                ...item,
                expire_date: expireDate ? expireDate.toISOString().split('T')[0] : null,
                alert_date: alertDate ? alertDate.toISOString().split('T')[0] : null,
                is_expired: expireDate && expireDate <= currentDate ? 1 : 0,
                is_alerted: alertDate && currentDate >= alertDate && (!expireDate || currentDate < expireDate) ? 1 : 0
            };
        });

        res.json(formattedItems);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Internal Server Error' });
    }
}

module.exports = { allItems };

