const BAD_REQUEST_STATUS_CODE = 400;
const ITEM_NOT_FOUND_STATUS_CODE = 404;
const INTERNAL_SERVER_ERROR_STATUS_CODE = 500;

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

module.exports = {
  handleValidationError,
  handleCastError,
  handleNotFoundError,
  handleGenericError,
  ITEM_NOT_FOUND_STATUS_CODE,
};
