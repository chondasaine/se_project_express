require("dotenv").config();
const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const likeRouter = require("./likes");
const { ITEM_NOT_FOUND_STATUS_CODE } = require("../utils/errors");
const auth = require("../middleware/auth");

router.use(auth);
router.use("/users", userRouter);
router.use("/items", itemRouter);
router.use("/items", likeRouter);

router.use("*", (req, res) => {
  res
    .status(ITEM_NOT_FOUND_STATUS_CODE)
    .json({ message: "Requested resource not found" });
});

module.exports = router;
