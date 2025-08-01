const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
} = require("../controllers/clothingItems");
const auth = require("../middleware/auth");

router.get("/", getItems);

router.use(auth);
router.post("/", createItem);
router.delete("/:itemId", deleteItem);

module.exports = router;
