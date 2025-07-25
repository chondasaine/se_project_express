const User = require("../models/user");
const {
  handleValidationError,
  handleCastError,
  handleNotFoundError,
  handleGenericError,
} = require("../utils/errors");

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
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError")
        return handleValidationError(err, res);
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

module.exports = { getUsers, createUser, getUserById };
