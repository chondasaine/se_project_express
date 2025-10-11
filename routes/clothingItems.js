const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
} = require("../controllers/clothingItems");
const auth = require("../middleware/auth");
const { validateItemBody, validateId } = require("../middleware/validation");

router.get("/", getItems);

router.use(auth);
router.post("/", validateItemBody, createItem);
router.delete("/:itemId", validateId, deleteItem);

module.exports = router;
