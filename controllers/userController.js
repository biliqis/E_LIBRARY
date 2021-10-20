const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userProfile = require("../models/userprofile");

//USER REGISTER LOGIC
const userRegister = async (req, res) => {
	//REFACTOR: use better names e.g userRegistration
	try {
		const { first_name, last_name, email, password, country } = req.body;
		if (!(first_name || last_name || email || password || country))
			res.status(400).send("All input is required");

		const checkUser = await User.findOne({ email });
		if (checkUser) {
			return res.status(409).send("User Already Exist. Please Login");
		}

		//ENCRYPTION OF PASSWORD
		const salt = await bcrypt.genSalt(10);

		const encryptedPassword = await bcrypt.hash(password, salt);
		const jwtSecretKey = process.env.JWT_SECRET;
		console.warn("jwtSecretKey", jwtSecretKey);

		const user = await User.create({
			first_name,
			last_name,
			email,
			password: encryptedPassword,
		});
		let newUserProfile = await new userProfile();
		newUserProfile.user = user._id;
		await newUserProfile.save();
		const token = await jwt.sign({ user_id: user._id, email }, jwtSecretKey, {
			expiresIn: "24h",
		});
		const result = { ...user.toJSON() };

		return res.status(201).json(result);
	} catch (err) {
		console.error(err);
		return res.status(500).send(err.message);
	}
};
//USERLOGIN LOGIC
const userLogin = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.find({
			email,
		});

		if (!user) return res.status(404).json({ message: "account not found" });

		const comparePassword = bcrypt.compare(password, user.password);

		if (!comparePassword)
			return res.status(400).json({ message: "Invalid email or password" });

		const loginUser = jwt.sign(
			{
				user: {
					id: user._id,
					first_name: user.first_name,
					last_name: user.last_name,
				},
			},
			process.env.JWT_SECRET,
			{
				expiresIn: process.env.JWT_EXP,
			}
		);
		return res.status(200).json({
			user: {
				token: loginUser,
				first_name: user.first_name,
				last_name: user.last_name,
			},
			message: "login successful!",
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: err.message });
	}
};

//UPDATED USER LOGIC
const updatedUser = async (req, res) => {
	const id = req.params.id;
	try {
		const { age, gender, occupation, phonenumber } = req.body;

		const updatedUser = await userProfile.findByIdAndUpdate(id, req.body, {
			new: true,
		});

		return res.status(200).json({
			message: "Updated user",
			data: updatedUser,
		});
	} catch (error) {
		console.error(err);
		return res.status(500).send(error.message);
	}
};

const getUserProfile = async (req, res) => {
	try {
		let allProfile = await userProfile.find({}).lean().populate("user");
		return res.status(200).json({
			data: allProfile,
			success: "yes",
		});
	} catch (err) {
		console.error(err);
		return res.status(500).send(err.message);
	}
};

module.exports = {
	userLogin,
	userRegister,
	updatedUser,
	getUserProfile,
};

//TODO: implement endpoint parameter validations as middleware
