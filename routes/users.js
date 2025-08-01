const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const auth = require("../middleware/auth");

router.use(auth);
router.get("/:userId", getCurrentUser);
router.patch("/user/me", updateProfile);

module.exports = router;
