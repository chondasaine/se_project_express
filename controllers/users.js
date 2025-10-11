const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const BadRequestError = require("../middleware/errors/BadRequestError");
const UnauthorizedError = require("../middleware/errors/UnauthorizedError");
const NotFoundError = require("../middleware/errors/NotFoundError");
const ConflictError = require("../middleware/errors/ConflictError");
const UnforeseenError = require("../middleware/errors/UnforeseenError");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  if (!password || password.length < 8) {
    return next(
      new BadRequestError("Password must be at least 8 characters long")
    );
  }
  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        throw new ConflictError("Email already exists");
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userData = user.toObject();
      delete userData.password;
      res.status(201).send(userData);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid user data"));
      }
      return next(new UnforeseenError("Failed to create user"));
    });
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.findOne({ _id })
    .orFail()
    .then((user) => {
      // eslint-disable-next-line no-unused-vars
      const { password, ...userData } = user.toObject();
      res.status(200).send(userData);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user Id format"));
      }
      return next(new UnforeseenError("Failed to fetch user"));
    });
};

const loginByCredential = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

  try {
    const user = await User.findUserByCredentials(email, password);

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      throw new UnauthorizedError("Incorrect password");
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    return res.send({ token });
  } catch (err) {
    return next(new UnauthorizedError("Invalid email or password"));
  }
};

const updateProfile = (req, res, next) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;
  if (!name && !avatar) {
    return next(new BadRequestError("Name or Avatar must be provided"));
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
      const userData = updatedUser.toObject();
      delete userData.password;
      res.status(200).send(userData);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid profile data"));
      }

      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      }
      return next(new UnforeseenError("Failed to update profile"));
    });
};
module.exports = {
  createUser,
  getCurrentUser,
  loginByCredential,
  updateProfile,
};
