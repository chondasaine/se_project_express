const { handleAuthRequiredError } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleAuthRequiredError(
      new Error("Authorization header is missing or incorrect"),
      res
    );
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return handleAuthRequiredError(err, res);
  }
  req.user = payload;
  next();
};
