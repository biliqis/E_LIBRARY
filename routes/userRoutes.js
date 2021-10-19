
const router = require("express").Router();
const { userRegister, userLogin, updatedUser,getUserProfile } = require("../controllers/userController")
router.get('/get-profile',getUserProfile)
router.post("/register", userRegister);
router.post("/login", userLogin);
router.put("/updatedUser/:id", updatedUser)
module.exports = router;

