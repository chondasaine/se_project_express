const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../middleware/errors/BadRequestError");
const NotFoundError = require("../middleware/errors/NotFoundError");
const UnforeseenError = require("../middleware/errors/UnforeseenError");
const ForbiddenError = require("../middleware/errors/ForbiddenError");

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    // eslint-disable-next-line no-unused-vars
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      next(new UnforeseenError("Failed to fetch clothing items"));
    });
};
const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(
          new BadRequestError("Invalid data provided for clothing item")
        );
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid ID format"));
      }
      return next(new UnforeseenError("Failed to create clothing item"));
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== String(userId)) {
        throw new ForbiddenError("You are not allowed to delete this item");
      }

      return ClothingItem.findByIdAndDelete(itemId);
    })
    .then((deletedItem) => res.status(200).send(deletedItem))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Clothing item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID format"));
      }
      return next(new UnforeseenError("Failed to delete clothing item"));
    });
};

module.exports = { getItems, createItem, deleteItem };
