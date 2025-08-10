const jwt = require("jsonwebtoken");
const { handleAuthRequiredError } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleAuthRequiredError(
      new Error("Authorization header is missing or incorrect"),
      res
    );
  }

  const token = authorization.replace("Bearer ", "");
  if (!token) {
    return handleAuthRequiredError(
      new Error("Token is missing in the authorization header"),
      res
    );
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return handleAuthRequiredError(err, res);
  }
};
