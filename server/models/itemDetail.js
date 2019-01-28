var mongoose = require("mongoose")
var Schema = mongoose.Schema

var ItemDetailSchema = new Schema({
	itemId: String,
	userId: String,
	itemName: String,
	itemAmount: Number,
	itemPrice: Number,
	journalUsage: Number,
	itemUsage: Number
})

var ItemDetail = mongoose.model("ItemDetail", ItemDetailSchema)
module.exports = ItemDetail