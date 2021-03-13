const mongoose = require("mongoose");

const ItemsSchema = new mongoose.Schema(
	{
		item: { type: String, required: true },
		cant: { type: Number, required: true },
	},
	{ timestamp: true, versionKey: false }
);
const Item = mongoose.model("items", ItemsSchema);
module.exports = Item;
