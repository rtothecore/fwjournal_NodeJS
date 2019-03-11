var mongoose = require("mongoose")
var Schema = mongoose.Schema

var ItemDetailSchema = new Schema({
	parentId: String,
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