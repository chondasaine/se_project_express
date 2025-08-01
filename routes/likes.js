const router = require("express").Router();
const { likeItem, unlikeItem } = require("../controllers/likes");
const auth = require("../middleware/auth");

router.use(auth);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", unlikeItem);

module.exports = router;
