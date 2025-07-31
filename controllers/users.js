const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  handleValidationError,
  handleCastError,
  handleNotFoundError,
  handleGenericError,
  handleHTTPConflictError,
  handleAuthError,
  UNAUTHORIZED,
} = require("../utils/errors");
//const {JWT_SECRET} = require('../utils/config');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.name === "ValidationError")
        return handleValidationError(err, res);
      return handleGenericError(err, res);
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      return User.create({ name, avatar, email, password: hash });
    })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError")
        return handleValidationError(err, res);
      if (err.code === 11000) return handleHTTPConflictError(err, res);

      return handleGenericError(err, res);
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError")
        return handleNotFoundError(err, res);
      if (err.name === "CastError") return handleCastError(err, res);
      return handleGenericError(err, res);
    });
};

const loginByCredential = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials({ email, password })
    .then((user) => {
      if (!user) {
        return handleAuthError(null, res);
      }
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return handleAuthError(null, res);
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      res.status(UNAUTHORIZED).send({ message: err.message });
    });
};

module.exports = { getUsers, createUser, getUserById, loginByCredential };
