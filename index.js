// server setup
const express = require('express');
require('dotenv').config();

const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
// console.log(process.env.DB_Username);
// console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_Username}:${process.env.DB_PASS}@cluster0.9bbp7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// middle ware
// console.log(uri);

// this is database username : CoffeeMaster
// this is database current user password : Ze6aCyKWyMkd4a5K


// mongodb sensitive code 








app.use(cors());
app.use(express.json());

 app.get('/',(req,res)=>{
    res.send('coffee server is runnig now fun time') 
  })


app.listen(port,()=>{
    console.log(`coffee server running port is are ${port}`);
    
})




// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // create a database in the mongodb

    // const database = client.db();
    // create a data with the coffeedata database
    const coffeecollection = client.db('coffeedata').collection('singlecoffee');
// take the data in the front end and give them in mongodb
// create api for coffee data start
app.post('/coffee',async(req,res)=>{
  const coffeedata = req.body;
  console.log('the data come to the front end via',coffeedata);
  const result = await coffeecollection.insertOne(coffeedata);
  res.send(result)
})

// take data in the mongodb and show them in front end
app.get('/coffeeAll',async(req,res)=>{
  const cursor = coffeecollection.find();
  const result = await cursor.toArray();
  res.send(result)
})


// delete operation via mongodb

app.delete('/coffeeAll/:id',async(req,res)=>{
  const id = req.params.id;
  const query = {_id : new ObjectId(id)}
  const result = await coffeecollection.deleteOne(query);
  res.send(result)
})
// get operation for update specific data

app.get('/coffeeAll/:id',async(req,res)=>{
  const id = req.params.id;
  const query = {_id : new ObjectId(id)};
  const result = await coffeecollection.findOne(query);
  res.send(result)
})

// updated coffee by this own id 


app.put('/coffee/:id',async(req,res)=>{
  const id = req.params.id;
  const filter = {_id : new ObjectId(id)};
  const option = { Upsert : true }
  const updatedcoffee = req.body;
  const coffee  = {
    $set :{
      name :updatedcoffee.name,
       chef:updatedcoffee.chef,
       supplier:updatedcoffee.supplier,
       taste:updatedcoffee.taste,
       category:updatedcoffee.category,
       details:updatedcoffee.details,
       photo : updatedcoffee.photo
    }
  }

const result = await coffeecollection.updateOne(filter,coffee,option)
res.send(result)
})
// create api for coffee data end here




// create api for userlogin using email and password  and senddata to mongodb

const UserEmailPassCollection = client.db('coffeedata').collection('emailpassuser');

// create user api and send data to mongodb

app.post('/useremail',async(req,res)=>{
  const userdata = req.body;
  console.log('the user is created succesfully',userdata);
  const result = await UserEmailPassCollection.insertOne(userdata);
  res.send(result)
  
})

// get the data in the mongodb and send to the front end

app.get('/alluseremail',async(req,res)=>{
  const cursor = UserEmailPassCollection.find();
  const result = await cursor.toArray();
  res.send(result)
})


// delete specific data using id with mongodb and send it to the front end

app.delete('/alluseremail/:id',async(req,res)=>{
  const id = req.params.id;
  const query = {_id : new ObjectId(id)};
  const result = await UserEmailPassCollection.deleteOne(query);
  res.send(result)
})
// edit specific data with email using this api {'alluseremail/:email'}

app.patch('/alluseremail',async(req,res)=>{
  const email = req.body.email;
  const filter  = {email};

const updatedDoc = {
  $set:{
    lastSignInTime : req.body?.lastSignInTime
  }
}
const result = await UserEmailPassCollection.updateOne(filter,updatedDoc);

res.send(result)

})







    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
