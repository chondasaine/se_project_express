const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const likeRouter = require("./likes");

router.use("/users", userRouter);
router.use("/items", itemRouter);
router.use("/items", likeRouter);

//error handling
router.use("*", (req, res) => {
  res.status(404).json({ message: "Requested resource not found" });
});

module.exports = router;
