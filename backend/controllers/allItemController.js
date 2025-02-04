const db = require('../database');

async function allItems(req, res){
    const query = 'select * from items';
    try{
        const[allitems]=await db.query(query);
        if(allitems.length === 0){
            return res.status(400).json({message:"No item found."});
        }
        res.json(allitems)
    }catch(error){
        return res.status(500).send({message:'Internal Server Error'});
    }
}

module.exports = {allItems};