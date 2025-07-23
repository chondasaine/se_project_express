const router = require("express").Router();
const {
  getItem,
  createItem,
  deleteItem,
} = require("../controllers/clothingItems");

router.get("/", getItem);
router.post("/", createItem);
router.delete("/:itemId", deleteItem);

module.exports = router;
