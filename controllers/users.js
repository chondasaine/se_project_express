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

const createUser = (req, res) => {
  console.log("Incoming signup payload:", req.body);
  const { name, avatar, email } = req.body;
  if (req.body.password.length < 8) {
    return res
      .status(BAD_REQUEST_STATUS_CODE)
      .send({ message: "Password must be at least 8 characters long" });
  }
  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        const conflictError = new Error("Email already exists");
        conflictError.code = 11000;
        throw conflictError;
      }
      return bcrypt.hash(req.body.password, 10);
    })
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userData = user.toObject();
      delete userData.password;
      res.status(201).send({
        _id: userData._id,
        name: userData.name,
        avatar: userData.avatar,
        email: userData.email,
      });
    })
    .catch((err) => {
      console.error("Signup error:", err);
      if (err.code === 11000) {
        return handleHTTPConflictError(err, res);
      }
      if (err.name === "ValidationError") {
        return handleValidationError(err, res);
      }
      return handleGenericError(err, res);
    });
};

const getCurrentUser = (req, res) => {
  const { _id } = req.user;

  User.findOne({ _id })
    .orFail()
    .then((user) => {
      const userData = user.toObject();
      delete userData.password;
      res.status(200).send({
        _id: userData._id,
        name: userData.name,
        avatar: userData.avatar,
        email: userData.email,
      });
    })
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

    if (!matched) {
      return handleAuthError(null, res);
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.send({ token });
  } catch (err) {
    return res.status(UNAUTHORIZED).send({ message: err.message });
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
  return User.findByIdAndUpdate(userId, updateObj, {
    new: true,
    runValidators: true,
  })
    .orFail(() => {
      const error = new Error("UserNotFound");
      error.name = "DocumentNotFoundError";
      throw error;
    })
    .then((updatedUser) => {
      if (!updatedUser) {
        throw new Error("UserNotFound");
      }
      const userData = updatedUser.toObject();
      delete userData.password;

      return res.status(200).send({
        _id: userData._id,
        name: updatedUser.name,
        avatar: updatedUser.avatar,
        email: updatedUser.email,
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return handleValidationError(err, res);
      }

      if (err.name === "DocumentNotFoundError") {
        return handleNotFoundError(err, res);
      }
      return handleGenericError(err, res);
    });
};
module.exports = {
  createUser,
  getCurrentUser,
  loginByCredential,
  updateProfile,
};
