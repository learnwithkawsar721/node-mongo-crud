const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
const cros = require("cors");
const ObjectId = require("mongodb").ObjectId;
// midilware
app.use(cros());
app.use(express.json());
// user: mydbuser1
// Password: Ms6Y6wYTQBDljHvE
const uri =
  "mongodb+srv://mydbuser1:Ms6Y6wYTQBDljHvE@cluster0.858ok.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// db = mongocrud
// table = users
async function run() {
  try {
    await client.connect();
    const database = client.db("mongocrud");
    const usersTable = database.collection("users");
    // get API
    app.get("/users", async (req, res) => {
      const cursor = usersTable.find({});
      const users = await cursor.toArray();
      res.send(users);
    });
    // find user
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersTable.findOne(query);
      console.log("find User ", id);
      res.send(result);
    });
    //Update User
    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const query = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updateUser = {
        $set: {
          name: data.name,
          email: data.email,
        },
      };
      const result = await usersTable.updateOne(query, updateUser, option);
      console.log("user Id:", id);
      console.log("data ", data);
      res.json(result);
    });
    // Delete User
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersTable.deleteOne(query);
      console.log("delete user", id);
      res.json(result);
    });

    // Post API
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await usersTable.insertOne(newUser);
      console.log("got new User : ", req.body);
      console.log("add New User: ", result);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Running my CRUD Surver");
});

app.listen(port, () => {
  console.log("Runnign Surver port:", port);
});
