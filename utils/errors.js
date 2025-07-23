const BAD_REQUEST_STATUS_CODE = 400;
const ITEM_NOT_FOUND_STATUS_CODE = 404;
const INTERNAL_SERVER_ERROR_STATUS_CODE = 500;

function handleError(err, res) {
  console.error(err);

  if (err.name === "DocumentNotFoundError") {
    return res
      .status(ITEM_NOT_FOUND_STATUS_CODE)
      .send({ message: err.message });
  }

  if (err.name === "CastError") {
    return res.status(BAD_REQUEST_STATUS_CODE).send({ message: err.message });
  }

  if (err.name === "ValidationError") {
    return res.status(BAD_REQUEST_STATUS_CODE).send({ message: err.message });
  }
  return res
    .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
    .send({ message: err.message });
}

module.exports = {
  handleError,
};
