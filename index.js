const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const uri =
  "mongodb+srv://OrganicDB:dwL4UH8FjaiaP$$@cluster0.wmpww.mongodb.net/OrganicDB?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

client.connect((err) => {
  const productCollection = client.db("OrganicDB").collection("products");
  //   read product
  app.get("/products", (req, res) => {
    productCollection.find({})
    .toArray((error, documents) => {
      res.send(documents);
    });
  });

  //   create product
  app.post("/addProduct", (req, res) => {
    const product = req.body;
    productCollection.insertOne(product)
    .then((result) => {
      console.log("Product Data added Successfully");
      // res.send("success punched");
      res.redirect("/");
    });
  });

  console.log("database ready now");


  // load product
  app.get('/product/:id',(req,res)=>{
    productCollection.find({_id: ObjectId(req.params.id)})
    .toArray((error,documents)=>{
      res.send(documents[0]);
    })
  })

  // update products
  app.patch('/update/:id',(req,res)=>{
    productCollection.updateOne({ _id: ObjectId(req.params.id) },
    
    {
      $set:{price: req.body.price, quantity: req.body.quantity}

    } )
    .then(result=>{
      res.send(result.modifiedCount>0);
    })
    
    
   
    
  })

  // delete products
  app.delete("/delete/:id", (req, res) => {
    console.log(req.params.id);
    productCollection
      .deleteOne({ _id: ObjectId(req.params.id) })

      .then((result) => {
       res.send(result.deletedCount>0);
       
      });
  });
});

app.listen(3000);
