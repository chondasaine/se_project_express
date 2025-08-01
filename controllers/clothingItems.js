const ClothingItem = require("../models/clothingItem");
const {
  handleValidationError,
  handleCastError,
  handleNotFoundError,
  handleGenericError,
  handleForbiddenError,
} = require("../utils/errors");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((item) => res.status(200).send(item))
    .catch((err) => handleGenericError(err, res));
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError")
        return handleValidationError(err, res);
      if (err.name === "CastError") return handleCastError(err, res);
      return handleGenericError(err, res);
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== String(userId)) {
        const err = new Error("You are not allowed to delete this item");
        err.name = "Forbidden";
        throw err;
      }

      return ClothingItem.findByIdAndDelete(itemId);
    })
    .then((deletedItem) => res.status(200).send(deletedItem))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError")
        return handleNotFoundError(err, res);
      if (err.name === "CastError") return handleCastError(err, res);
      if (err.name === "Forbidden") return handleForbiddenError(err, res);

      return handleGenericError(err, res);
    });
};

module.exports = { getItems, createItem, deleteItem };
