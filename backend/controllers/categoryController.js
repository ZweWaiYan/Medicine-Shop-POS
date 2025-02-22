const { ObjectId } = require("mongodb");
const { connectDB } = require('../mongodb_connector');
const { update } = require("./updateController");

let categoryCollection
async function Connectdb(){
    try{
        const client = await connectDB();
        const database = client.db('storeB');
        categoryCollection = database.collection('category')
    }catch(error){
        console.log(error);
    }

}
Connectdb();

async function addCategory(req,res){
    const name = req.body.name;
    try{
        const result = await categoryCollection.updateOne(
            {name : name},
            {$setOnInsert :{name : name}},
            {upsert : true}
        );

        if(result.upsertedCount > 0){
            res.status(201).json({message:`Category ${name} inserted.`});
        }else{
            res.status(200).json({message : `Category '${name}' already exists`});
        }
    }catch(error){
        console.log(error)
        return res.status(500).json({message:"Internal server error while inserting category."})
    }
}


async function fetchCategory(req,res){
    try{
        const categories = await categoryCollection.find().toArray();
        res.json(categories);
    }catch(error){
        console.log(error);
        res.status(500).json({ error: "Error fetching categories"})
    }
}

async function updateCategory(req,res){
    const name = req.body.newName;
    try{
        const result = await categoryCollection.updateOne(
            {_id : new ObjectId(req.params.id)},
            {$set :{name : name}}
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({ message: "Category updated successfully" });
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Error updating category."});
    }
}

async function deleteCategory(req,res){
    try{
        const result = await categoryCollection.deleteOne({_id: new ObjectId(req.params.id)})
        if(result.deletedCount === 0){
            return res.status(404).json({message : "Category not found."})
        }
        res.status(200).json({message:"Category deleted successfully."})
    }catch(error){
        console.log(error)
        return res.status(500).json({message:"Error deleting category."})
    }
}

module.exports = {
    addCategory,
    fetchCategory,
    updateCategory,
    deleteCategory
}