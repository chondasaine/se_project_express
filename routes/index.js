require("dotenv").config();
const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const likeRouter = require("./likes");
const { NotFoundError } = require("../middleware/errors/NotFoundError");
const auth = require("../middleware/auth");

router.use("/items", itemRouter);
router.use("/items", likeRouter);

router.use(auth);
router.use("/users", userRouter);

router.use("*", (req, res, next) => {
  next(new NotFoundError("Requested route does not exist"));
});

module.exports = router;
