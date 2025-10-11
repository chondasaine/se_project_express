require("dotenv").config();

const express = require("express");

const app = express();
const mongoose = require("mongoose");

const cors = require("cors");

const { errors } = require("celebrate");

const indexRouter = require("./routes/index");

const { createUser, loginByCredential } = require("./controllers/users");

const { PORT = 3001 } = process.env;

const { errorHandler } = require("./middleware/error-handler");

const { requestLogger, errorLogger } = require("./middleware/logger");

const {
  validateLoginBody,
  validateUserBody,
} = require("./middleware/validation");

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("Connected to DB");
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error("DB connection error:", err);
  });

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

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening at port ${PORT}`);
});
