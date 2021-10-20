const bcrypt = require("bcrypt");
let emailRegexVal =
	/^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/;
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	first_name: {
		type: String,
		required: true,
	},

	last_name: {
		type: String,
		required: true,
	},

	email: {
		type: String,
		unique: true,
		validate: {
			validator: function (v) {
				return emailRegexVal.test(v);
			},
			message: (mail) => `${mail.value} is not a valid email address !`,
		},
		required: [true, "Please enter your email address"], //REFACTOR: move validator away from model. implement is as a middleware
	},

	password: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("Users", userSchema);
