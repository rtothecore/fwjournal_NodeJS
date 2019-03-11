var mongoose = require("mongoose")
var Schema = mongoose.Schema

var ItemSchema = new Schema({
	userId: String,
	date: String,
	landId: Schema.Types.ObjectId,
	item: String,
	itemDetail: [String],
	purpose: String,
	pictureA: String,
	pictureB: String,
	pictureC: String
})

var Item = mongoose.model("Item", ItemSchema)
module.exports = Item