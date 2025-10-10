require("dotenv").config();

const express = require("express");

const app = express();
const mongoose = require("mongoose");

const cors = require("cors");

const indexRouter = require("./routes/index");

const { createUser, loginByCredential } = require("./controllers/users");

const { PORT = 3001 } = process.env;

const { errors } = require("celebrate");

const { errorHandler } = require("./middleware/error-handler");

const { requestLogger, errorLogger } = require("./middleware/logger");

const {
  validateLoginBody,
  validateUserBody,
} = require("./middleware/validation.js");

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use(cors());
app.use(requestLogger);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.post("/signin", validateLoginBody, loginByCredential);
app.post("/signup", validateUserBody, createUser);

app.use("/", indexRouter);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
