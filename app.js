const express = require("express");

const app = express();
const mongoose = require("mongoose");

const cors = require("cors");

const indexRouter = require("./routes/index");

const { createUser, loginByCredential } = require("./controllers/users");

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use(cors());

app.post("/signin", loginByCredential);
app.post("/signup", createUser);

app.use("/", indexRouter);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
