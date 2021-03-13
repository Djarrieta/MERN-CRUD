const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
	{
		userName: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
		admin: { type: Boolean },
	},
	{ timestamp: true, versionKey: false }
);
const User = mongoose.model("users", UserSchema);
module.exports = User;
