const router = require("express").Router();
const { likeItem, unlikeItem } = require("../controllers/likes");

router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", unlikeItem);

module.exports = router;
