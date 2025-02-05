const { all } = require('axios');
const db = require('../database');
//SELECT *, CASE WHEN expire_date < CURDATE() THEN 1 ELSE 0 END AS is_expired FROM items
async function allItems(req, res){
    const query = `
            SELECT *, 
                DATE_FORMAT(expire_date, '%Y-%m-%d') AS expire_date, 
                DATE_FORMAT(alert_date, '%Y-%m-%d') AS alert_date,
                CASE WHEN expire_date <= CURDATE() THEN 1 ELSE 0 END AS is_expired,
                CASE WHEN CURDATE() >= COALESCE(alert_date, '9999-12-31') AND alert_date < expire_date THEN 1 ELSE 0 END AS is_alerted
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

module.exports = {allItems};