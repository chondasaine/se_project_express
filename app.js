const express = require("express");
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");
const { createUser, loginByCredential } = require("./controllers/users");
const app = express();
const { PORT = 3001 } = process.env;
const cors = require("cors");

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.post("/signin", loginByCredential);
app.post("/signup", createUser);

app.use(express.json());
app.use("/", indexRouter);

app.use(cors());

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
