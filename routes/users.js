const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const auth = require("../middleware/auth");
const { validateUserUpdateBody } = require("../middleware/validation");

router.use(auth);

router.get("/me", getCurrentUser);
router.patch("/me", validateUserUpdateBody, updateProfile);

module.exports = router;
