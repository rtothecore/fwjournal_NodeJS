var mongoose = require("mongoose")
var Schema = mongoose.Schema

var ItemDetailSchema = new Schema({
	itemName: String,
	itemAmount: Number,
	itemPrice: Number,
	itemUsage: Number,
	itemStock: Number
})

var ItemSchema = new Schema({
	userId: String,
	date: String,
	landId: String,
	item: String,
	itemDetail: [ItemDetailSchema],
	purpose: String,
	pictureA: String,
	pictureB: String,
	pictureC: String
})

var Item = mongoose.model("Item", ItemSchema)
module.exports = Item