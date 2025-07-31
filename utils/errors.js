const BAD_REQUEST_STATUS_CODE = 400;
const ITEM_NOT_FOUND_STATUS_CODE = 404;
const INTERNAL_SERVER_ERROR_STATUS_CODE = 500;
const SERVER_CANNOT_COMPLETE_REQUEST = 409;
const UNAUTHORIZED = 401;

function handleValidationError(err, res) {
  console.error("ValidationError:", err);
  return res.status(BAD_REQUEST_STATUS_CODE).send({ message: err.message });
}

function handleCastError(err, res) {
  console.error("CastError:", err);
  return res.status(BAD_REQUEST_STATUS_CODE).send({ message: err.message });
}

function handleNotFoundError(err, res) {
  console.error("DocumentNotFoundError:", err);
  return res.status(ITEM_NOT_FOUND_STATUS_CODE).send({ message: err.message });
}

function handleGenericError(err, res) {
  console.error("ServerError:", err);
  return res
    .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
    .send({ message: "An error has occurred on the server" });
}

function handleHTTPConflictError(err, res) {
  console.error("HTTP409Conflict:", err);
  return res
    .status(SERVER_CANNOT_COMPLETE_REQUEST)
    .send({ message: "Email already exists" });
}

function handleAuthError(err, res) {
  console.error("AuthError", err);
  return res
    .status(UNAUTHORIZED)
    .send({ message: "Incorrect email or password" });
}

module.exports = {
  handleValidationError,
  handleCastError,
  handleNotFoundError,
  handleGenericError,
  handleHTTPConflictError,
  handleAuthError,
  ITEM_NOT_FOUND_STATUS_CODE,
  UNAUTHORIZED,
};
