var mongoose = require("mongoose")
var Schema = mongoose.Schema

var McSchema = new Schema({
	bCode: String,
	mCode: String,
	text: String
})

var Mc = mongoose.model("Mc", McSchema)
module.exports = Mc