const express = require("express");
const app = express();
var cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yhskc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const inventoryCollection = client
      .db("car-warehouse-management-app ")
      .collection("car-managment");
    console.log("Database Connect Hoise");
    //myItem database connection
    const myItems = client
      .db("car-warehouse-management-app ")
      .collection("myItem");
    console.log("Database Connect Hoise 3");

    app.get("/Warehouse-item", async (req, res) => {
      const query = {};
      const cursor = inventoryCollection.find(query);
      const items = await cursor.toArray();
      res.send(items);
    });
    //additem
    app.get(`/Warehouse-item/:id`, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const item = await inventoryCollection.findOne(query);
      res.send(item);
    });
    // POST
    app.post("/Warehouse-item/", async (req, res) => {
      const newProduct = req.body;
      const result = await inventoryCollection.insertOne(newProduct);
      res.send(result);
    });
    // PRODUCT ITEM SINGLE UPDATE
    app.put("/Warehouse-item/:id", async (req, res) => {
      const id = req.params.id;
      const updateUser = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updateUser.name,
          price: updateUser.price,
        },
      };
      const result = await inventoryCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      req.send(result);
    });

    // PRODUCT ITEM SINGLE DELETE
    app.delete("/Warehouse-item/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await inventoryCollection.deleteOne(query);
      res.send(result);
    });
    // myItem
    app.get("/myItem", async (req, res) => {
      const query = {};
      const cursor = myItems.find(query);
      const items = await cursor.toArray();
      res.send(items);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello server ready ache !");
});

app.listen(port, () => {
  console.log(`listening  on port ${port}`);
});
