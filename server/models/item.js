var mongoose = require("mongoose")
var Schema = mongoose.Schema

var ItemDetailSchema = new Schema({
	itemName: String,
	itemAmount: String,
	itemPrice: String,
	itemUsage: String,
	itemStock: String
})

var ItemSchema = new Schema({
	userId: String,
	date: String,
	item: String,
	itemDetail: [ItemDetailSchema],
	purpose: String,
	pictureA: String,
	pictureB: String,
	pictureC: String
})

var Item = mongoose.model("Item", ItemSchema)
module.exports = Item