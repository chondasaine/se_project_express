const router = require("express").Router();
const { likeItem, unlikeItem } = require("../controllers/likes");
const auth = require("../middleware/auth");
const { validateId } = require("../middleware/validation.js");

router.use(auth);
router.put("/:itemId/likes", validateId, likeItem);
router.delete("/:itemId/likes", validateId, unlikeItem);

module.exports = router;
