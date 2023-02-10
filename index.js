const express = require('express');
const cors = require('cors');
 const { MongoClient, ObjectId, } = require('mongodb');
const { json } = require('express');
const dotenv = require('dotenv').config();

const app = express()
app.use(json())
app.use(cors())

const PORT = 5000

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sfale.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri)
const run = async ()=>{
try{

    await client.connect()
    const db =  client.db('moon-tech')
    const collection = db.collection('moon-tech')
    console.log('DB is running')
    app.get('/products', async (req,res)=>{
        res.send(await collection.find().toArray())
    })
    app.get('/products/:id', async (req,res)=>{
        console.log('req.params.id',req.params.id)
        res.send(await collection.findOne({_id:new ObjectId(req.params.id)}))
    })
    app.post('/products', async (req,res)=>{
        console.log(req.body)
        res.send(await collection.insertOne(req.body))
    })
    app.put('/products/:id', async (req,res)=>{
        console.log(req.body)
        const {_id,...data} = req.body
        const updateDoc={$set:{...data}}
        res.send(await collection.updateOne({_id:new ObjectId(_id)},updateDoc,{upsert:true}))
    })

    app.delete('/products/:id', async (req,res)=>{
        console.log(req.params.id)
        res.send(await collection.deleteOne({_id: new ObjectId(req.params.id)}))
    })

}catch(err){console.log(err)}

}
 
run().catch(err=>console.dir(err))
app.get('/',(req,res)=>{
    res.send({status:true, message:`server is running at ${PORT} Port`})
})

app.listen(PORT,()=>{console.log(`server is running at ${PORT} Port`)})
