const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
	{
		userName: { type: String, required: true },
		password: { type: String, required: true },
		role: { type: String },
	},
	{ timestamp: true, versionKey: false }
);
const User = mongoose.model("users", UserSchema);
module.exports = User;
