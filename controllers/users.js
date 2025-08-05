const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  handleValidationError,
  handleCastError,
  handleNotFoundError,
  handleGenericError,
  handleHTTPConflictError,
  handleAuthError,
  BAD_REQUEST_STATUS_CODE,
  UNAUTHORIZED,
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
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      return User.create({ name, avatar, email, password: hash });
    })
    .then((user) => {
      const userData = user.toObject();
      delete userData.password;
      res.status(201).send(userData);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return handleValidationError(err, res);
      }
      if (err.code === 11000) return handleHTTPConflictError(err, res);
      {
        return handleGenericError(err, res);
      }
    });
};

const getCurrentUser = (req, res) => {
  const { userId } = req.user;

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

const loginByCredential = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST_STATUS_CODE)
      .send({ message: "Email and password are required" });
  }

  try {
    const user = await User.findUserByCredentials(email, password);
    if (!user) {
      return handleAuthError(null, res);
    }

    const matched = await bcrypt.compare(password, user.password);
    console.log("Password match result:", matched);
    if (!matched) {
      return handleAuthError(null, res);
    }
    console.log("JWT_SECRET value:", JWT_SECRET);
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log("Login successful, sending token:", token);
    res.send({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(UNAUTHORIZED).send({ message: err.message });
  }
};

const updateProfile = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  if (!name && !avatar) {
    return handleValidationError(
      new Error("Name or Avatar must be provided"),
      res
    );
  }
  const updateObj = {
    ...(name ? { name } : {}),
    ...(avatar ? { avatar } : {}),
  };
  User.findByIdAndUpdate(userId, updateObj, {
    new: true,
    runValidators: true,
  })
    .orFail()
    .then((updatedUser) => res.status(200).send({ data: updatedUser }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return handleValidationError(err, res);
      }
      return handleNotFoundError(err, res);
    });
};

module.exports = {
  getUsers,
  createUser,
  getCurrentUser,
  loginByCredential,
  updateProfile,
};
