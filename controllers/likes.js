const ClothingItem = require("../models/clothingItem.js");
const { handleError } = require("../utils/errors");

module.exports.likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, 
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => handleError(err, res));
};

module.exports.unlikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => handleError(err, res));
};
