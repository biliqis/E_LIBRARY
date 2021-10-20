const router = require("express").Router();
const {
	userRegister,
	userLogin,
	updatedUser,
	getUserProfile,
} = require("../controllers/userController");
router.get("/get-profile", getUserProfile);
router.post("/register", userRegister); //REFACTOR: this endpoint is not working please look into it
router.post("/login", userLogin);
router.put("/updatedUser/:id", updatedUser); //REFACTOR: update/:id sounds better as the address
module.exports = router;
